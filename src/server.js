// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { testRedisConnection } from "./config/redis.js";
import { producer } from "./config/kafka.js";
import { startClickConsumer } from "./consumers/click.consumer.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  await testRedisConnection();
  await producer.connect(); // connect to kafka producer
  await startClickConsumer(); // start kafka consumer

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
