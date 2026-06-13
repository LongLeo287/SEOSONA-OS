/**
 * Check if the host is 1code.dev domain
 * Client-side: is1CodeDomain() - reads from window.location
 * Server-side: is1CodeDomain(host) - pass host string
 */
export function is1CodeDomain(host?: string): boolean {
  if (typeof window !== "undefined") {
    const hostname = host ?? window.location.host
    return hostname.includes("1code.dev")
  }
  return host?.includes("1code.dev") ?? false
}
