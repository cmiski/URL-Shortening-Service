import Url from "../models/url.model.js";
import { generateBase62 } from "../utils/base62.js";
import redis from "../config/redis.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export const shortenUrl = async (longUrl) => {
  // Normalize URL → canonical identity
  const normalizedUrl = normalizeUrl(longUrl);

  // Redis HOT PATH (idempotency cache)
  // Same logical URL should never hit DB repeatedly
  const cacheKey = `short:url:${normalizedUrl}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    // FAST RETURN: 0 db hit
    return JSON.parse(cached);
  }

  // Fast DB read
  const existing = await Url.findOne({
    normalizedUrl,
    isActive: true,
  }).lean();

  if (existing) {
    const result = {
      shortCode: existing.shortCode,
      shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
    };

    // Warm Redis so next request skips DB
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 60);

    return result;
  }

  // Try to CREATE (race-safe section)
  // teo req st sam etime --> mongoDB unique index decides who win
  const shortCode = generateBase62();

  try {
    const urlDoc = await Url.create({
      shortCode,
      rawLongUrl: longUrl,
      longUrl: normalizedUrl,
      normalizedUrl,
      isActive: true,
    });

    const result = {
      shortCode: urlDoc.shortCode,
      shortUrl: `${process.env.BASE_URL}/${urlDoc.shortCode}`,
    };

    // Cache BOTH paths
    // a) POST /shorten idempotency
    await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 60);

    // b) GET /:shortCode redirect
    await redis.set(`url:${urlDoc.shortCode}`, urlDoc.longUrl, "EX", 60 * 60);

    return result;
  } catch (err) {
    // Expected race condition (normalizedUrl already exists)
    // 11000 -> MongoDB duplicate key error
    if (err.code === 11000 && err.keyPattern?.normalizedUrl) {
      const existing = await Url.findOne({ normalizedUrl }).lean();

      if (existing) {
        const result = {
          shortCode: existing.shortCode,
          shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
        };

        // Cache recovery result
        await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 60);

        return result;
      }
    }

    // Unknown error → crash loudly
    throw err;
  }
};
