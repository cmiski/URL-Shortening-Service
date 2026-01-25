export function normalizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== "string") {
    throw new Error("Invalid URL");
  }

  let url = inputUrl.trim();

  //  Ensure protocol exists
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const parsed = new URL(url);

  //  Force HTTPS (canonical)
  parsed.protocol = "https:";

  // Normalize hostname
  parsed.hostname = parsed.hostname.toLowerCase();

  // Remove leading www.
  if (parsed.hostname.startsWith("www.")) {
    parsed.hostname = parsed.hostname.slice(4);
  }

  // Remove default ports
  if (
    (parsed.protocol === "https:" && parsed.port === "443") ||
    (parsed.protocol === "http:" && parsed.port === "80")
  ) {
    parsed.port = "";
  }

  // Normalize pathname
  // Remove trailing slash INCLUDING root
  if (parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  // Ensure root path is empty, not ""
  if (parsed.pathname === "") {
    parsed.pathname = "/";
  }

  // Remove hash (never affects server resource)
  parsed.hash = "";

  // Query params are intentionally preserved
  // ?a=1 and ?a=2 are different resources

  return parsed.toString();
}
