import { z } from "zod";
import { isValidHostname } from "../utils/isValidHostname.js";

export const shortenSchema = z.object({
  longUrl: z
    .string()
    .min(1, "Url is required")
    .refine((val) => {
      let url;

      try {
        // case insensitive protocol regex
        // Check if the string already starts with a protocol (http://, https://, etc.)
        const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(val);
        // safe url parsing -> if protocol exists parse directly if not then assume https
        url = new URL(hasProtocol ? val : `https://${val}`);
      } catch {
        // clearly invalid url
        return false;
      }
      // only allow http and https protocols for security reasons
      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }
      // check if hostname is valid
      return isValidHostname(url.hostname);
    }, "Invalid URL format"),
});
