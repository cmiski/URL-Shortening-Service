import { z } from "zod";
import { isValidHostname } from "../utils/isValidHostname.js";

export const shortenSchema = z.object({
  longUrl: z
    .string()
    .min(1, "Url is required")
    .refine((val) => {
      let url;
      try {
        // only for parsing, NOT normalization
        url = new URL(val.startsWith("http") ? val : `https://${val}`);
      } catch {
        return false;
      }

      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }
      return isValidHostname(url.hostname);
    }, "Invalid URL format"),
});
