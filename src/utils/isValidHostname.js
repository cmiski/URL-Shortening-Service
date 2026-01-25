export function isValidHostname(hostname) {
  // must have a dot
  if (!hostname.includes(".")) {
    return false;
  }

  // no spaces
  if (/\s/.test(hostname)) {
    return false;
  }

  // RFC-ish hostname regex
  const hostnameRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;

  return hostnameRegex.test(hostname);
}
