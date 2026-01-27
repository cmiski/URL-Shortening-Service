import {
  resolveShortCode,
  emitClickEvent,
} from "../services/redirect.service.js";

export const redirectHandler = async (req, res) => {
  const { shortCode } = req.params; // destructure shortCode from request params

  const longUrl = await resolveShortCode(shortCode);

  if (!longUrl) {
    return res.status(404).json({ message: "URL not found" });
  }

  //redirect immediately

  // 302 : found --> analytics-friendly
  // res.status(302).redirect(longUrl); ->
  res.redirect(302, longUrl); // if i dont add 302 it automatically defaults to 302

  // fire-and-forget analytics
  // recordClick(shortCode).catch(console.error);

  emitClickEvent({
    shortCode,
    clickedAt: new Date(),
  });
};
