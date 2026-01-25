export function normalizeUrl(inputUrl) {
  let url = inputUrl.trim(); // remove whitespace from both ends

  // add protocl if missing
  // check using regex if URL already starts with "http://" or "https://"
  // i --> case insensitive flag
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`; // default to https is more secure than http
  }

  // parse the URL into an object with different properties
  const parsed = new URL(url);

  // normalize hostname
  // DNS is case insensitive --> always lowercasing prevents duplicates and collisions
  parsed.hostname = parsed.hostname.toLowerCase();

  // remove trailing slash but not root
  if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  // convert the modified URL back to a clean string
  return parsed.toString();
}
