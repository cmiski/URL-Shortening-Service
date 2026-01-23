import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  console.log("MongoDB connection string: ", process.env.MONGO_URI);
  console.log("Connected DB name:", mongoose.connection.name);
};
