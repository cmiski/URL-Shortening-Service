import { shortenUrl } from "../services/shorten.service.js";

export const shortUrlHandler = async (req, res) => {
  const { longUrl } = req.body; // destructure longUrl from request body

  if (!longUrl) {
    return res.status(400).json({ message: "longUrl is required" }); // 400 : bad request
  }

  const result = await shortenUrl(longUrl);

  return res.status(200).json(result);
};
