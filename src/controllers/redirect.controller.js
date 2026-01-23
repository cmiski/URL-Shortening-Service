import { resolveShortCode } from "../services/redirect.service.js";

export const redirectHandler = async (req, res) => {
  const { shortCode } = req.params; // destructure shortCode from request params

  const longUrl = await resolveShortCode(shortCode);

  if (!longUrl) {
    return res.status(404).json({ message: "URL not found" });
  }

  // 302 : found --> analytics-friendly
  res.status(302).redirect(longUrl);
};
