export function isValidHostname(hostname) {
  if (!hostname) return false;

  // lowercase ONLY for validation comparison
  const host = hostname.toLowerCase();

  // must have at least one dot (no localhost, no single word)
  if (!host.includes(".")) return false;

  // RFC-compatible hostname check
  const hostnameRegex =
    /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;

  return hostnameRegex.test(host);
}
