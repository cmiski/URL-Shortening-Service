// given a short code => retirve the long url

import redis from "../config/redis.js";
import Url from "../models/url.model.js";

export const resolveShortCode = async (shortCode) => {
  const cacheKey = `short:${shortCode}`;

  // redis first --> hot path
  const cachedUrl = await redis.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  // DB fallback --> cold path
  const urlDoc = await Url.findOne({
    shortCode, // indexed lookup
    isActive: true,
    // $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  }).lean(); // returns a plain js object not a mongoose document -> faster, less overhead and memory usage

  if (!urlDoc) {
    return null;
  }

  // backfill cache
  // cache the result for 1 hour -> prevents hammering the DB on next request for the same short code
  // redis TTL -> EX 3600 (1 hour)
  await redis.set(cacheKey, urlDoc.longUrl, "EX", 60 * 60);

  return urlDoc.longUrl;
};
