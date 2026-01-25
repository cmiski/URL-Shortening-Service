import { shortenSchema } from "../validation/shorten.schema.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";
import { shortenUrl } from "../services/shorten.service.js";

export const shortUrlHandler = async (req, res) => {
  // validate request body
  // safeParse() returns a ZodError object if validation fails otherwise returns object with .success + .data
  const parseResult = shortenSchema.safeParse(req.body);

  // 400 : bad request
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: parseResult.error.flatten().fieldErrors, // flatten() flattens the error object to a single level --> group errors by field name
    });
  }

  // const { longUrl } = req.body; // destructure longUrl from request body

  const { longUrl } = parseResult.data; // destructure longUrl from parsed request body

  // zod now normalize the URL for us so no need to do it here --> changed it again zod doesnt do it now
  // const normalizedUrl = normalizeUrl(longUrl);  --> removed normalization from the controller and will be done in service layer

  const result = await shortenUrl(longUrl);

  return res.status(201).json(result); // 201 : created
};
