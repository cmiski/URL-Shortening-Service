import Url from "../models/url.model.js";
import { generateBase62 } from "../utils/base62.js";
import redis from "../config/redis.js";

export const shortenUrl = async (longUrl) => {
  // idempotency check
  const existing = await Url.findOne({
    longUrl,
    isActive: true,
  }).lean();

  // return early if already exists
  if (existing) {
    return {
      shortCode: existing.shortCode,
      shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
    };
  }

  // collision-safe creation
  let urlDoc;
  while (!urlDoc) {
    const shortCode = generateBase62();

    try {
      urlDoc = await Url.create({
        shortCode,
        longUrl,
        isActive: true,
      });
    } catch (err) {
      // retry only on collision
      //  11000 is mongoDB duplicate key error
      if (err.code !== 11000) {
        throw err;
      }
    }
  }

  // warm redis --> write-through cache --> redis write cost is negligible
  await redis.set(
    `url:${urlDoc.shortCode}`,
    urlDoc.longUrl,
    "EX",
    60 * 60, // 1 hour
  );

  return {
    shortCode: urlDoc.shortCode,
    shortUrl: `${process.env.BASE_URL}/${urlDoc.shortCode}`,
  };
};
