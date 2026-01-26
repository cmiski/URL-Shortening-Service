import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true, // guarantees no two URLs collide
      index: true, // faster lookup to accomodate traffic
    },
    rawLongUrl: {
      type: String,
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    normalizedUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Url", urlSchema);
