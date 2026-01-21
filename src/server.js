import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { testRedisConnection } from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  await testRedisConnection();
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startServer();
