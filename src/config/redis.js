import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

export const testRedisConnection = async () => {
  const result = await redis.ping();
  console.log("Redis ping response: ", result);
};

export default redis;
