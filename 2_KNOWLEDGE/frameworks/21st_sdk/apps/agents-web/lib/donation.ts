export const DONATION_ALLOWED_DOMAINS = [
  "github.com",
  "buymeacoffee.com",
  "ko-fi.com",
  "patreon.com",
  "paypal.me",
  "paypal.com",
  "opencollective.com",
  "liberapay.com",
  "boosty.to",
  "buy.stripe.com",
  "donate.stripe.com",
  "lemonsqueezy.com",
]

export function isDonationDomainAllowed(hostname: string): boolean {
  return DONATION_ALLOWED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  )
}
