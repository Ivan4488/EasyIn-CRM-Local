const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const BLOCKED_DOMAINS: string[] = [
  // Shorteners
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "hubs.la",
  "hubs.li",
  "hubs.ly",
  // Link aggregators
  "linktr.ee",
  "beacons.ai",
  "carrd.co",
  // Social
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "youtube.com",
  "tiktok.com",
  "wa.me",
  // Marketplaces
  "amazon.com",
  "etsy.com",
  "ebay.com",
  // Hosted builders
  "wixsite.com",
  "wordpress.com",
  "squarespace.com",
  "shopify.com",
  "weebly.com",
  // Other
  "figma.com",
  "upwork.com",
  "yelp.com",
];

export function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "");
}

export function isCompanyDomainValid(
  domain: string
): { valid: boolean; reason?: string } {
  const normalized = normalizeDomain(domain);

  if (!normalized) {
    return { valid: false, reason: "empty" };
  }

  if (!DOMAIN_REGEX.test(normalized)) {
    return { valid: false, reason: "invalid_format" };
  }

  const isBlocked = BLOCKED_DOMAINS.some(
    (blocked) =>
      normalized === blocked || normalized.endsWith(`.${blocked}`)
  );

  if (isBlocked) {
    return { valid: false, reason: "blocklisted" };
  }

  return { valid: true };
}
