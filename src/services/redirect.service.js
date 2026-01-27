// given a short code => retirve the long url

import redis from "../config/redis.js";
import Url from "../models/url.model.js";

import { eventBus } from "../events/eventBus.js";
import { CLICK_EVENT } from "../events/click.events.js";

export const resolveShortCode = async (shortCode) => {
  const cacheKey = `url:${shortCode}`;

  // redis first --> hot path
  // console.log("About to check Redis");
  const cachedUrl = await redis.get(cacheKey);
  if (cachedUrl) {
    // console.log("Found in Redis");

    return cachedUrl;
  }

  // console.log("Not found in Redis");
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

// export async function recordClick(shortCode) {
//   await Url.updateOne(
//     { shortCode, isActive: true },
//     {
//       $inc: { clickCount: 1 },
//       $set: { lastClickedAt: new Date() },
//     },
//     {
//       upsert: false, // is also added by default is not explicitly specified --> says never create new document if shortCode not found
//     },
//   );
// }

// emitter function
export function emitClickEvent(payload) {
  eventBus.emit(CLICK_EVENT, payload);
}
