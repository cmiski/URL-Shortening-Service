import Url from "../models/url.model.js";

export const getStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    return res.status(200).json({
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      lastClickedAt: url.lastClickedAt,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
