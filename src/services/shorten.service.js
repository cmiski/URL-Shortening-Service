import Url from "../models/url.model.js";
import { generateBase62 } from "../utils/base62.js";
import redis from "../config/redis.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export const shortenUrl = async (longUrl) => {
  const normalizedUrl = normalizeUrl(longUrl);

  // Fast path
  const existing = await Url.findOne({
    normalizedUrl,
    isActive: true,
  }).lean();

  if (existing) {
    return {
      shortCode: existing.shortCode,
      shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
    };
  }

  const shortCode = generateBase62();

  try {
    const urlDoc = await Url.create({
      shortCode,
      longUrl,
      normalizedUrl,
      isActive: true,
    });

    await redis.set(`url:${urlDoc.shortCode}`, urlDoc.longUrl, "EX", 60 * 60);

    return {
      shortCode: urlDoc.shortCode,
      shortUrl: `${process.env.BASE_URL}/${urlDoc.shortCode}`,
    };
  } catch (err) {
    // normalizedUrl uniqueness conflict
    if (err.code === 11000 && err.keyPattern?.normalizedUrl) {
      const existing = await Url.findOne({ normalizedUrl }).lean();
      if (existing) {
        return {
          shortCode: existing.shortCode,
          shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
        };
      }
    }

    throw err;
  }
};
