import { z } from "zod";
import { isValidHostname } from "../utils/isValidHostname.js";

export const shortenSchema = z.object({
  longUrl: z
    .string()
    .min(1, "Url is required")
    .refine((val) => {
      let url;

      try {
        const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(val);

        url = new URL(hasProtocol ? val : `https://${val}`);
      } catch {
        return false;
      }

      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }

      return isValidHostname(url.hostname);
    }, "Invalid URL format"),
});
