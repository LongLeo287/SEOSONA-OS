/**
 * Security configuration for the application
 */

// Blocked hostname patterns for SSRF protection
const BLOCKED_HOSTNAME_PATTERNS = [
  // Local/private network ranges
  /^localhost$/i,
  /^127\.0\.0\.1$/,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./, // Link-local
  /^::1$/, // IPv6 localhost
  /^fc00::/i, // IPv6 unique local
  /^fe80::/i, // IPv6 link-local

  // Internal services
  /^metadata\.google\.internal$/i,
  /^169\.254\.169\.254$/, // AWS metadata service

  // Common internal domains
  /^internal$/i,
  /\.internal$/i,
  /^intranet$/i,
  /\.intranet$/i,
  /^local$/i,
  /\.local$/i,
]

// Additional blocked ports that could be used for port scanning
const BLOCKED_PORTS = [
  22, // SSH
  23, // Telnet
  25, // SMTP
  53, // DNS
  110, // POP3
  143, // IMAP
  993, // IMAPS
  995, // POP3S
  1433, // SQL Server
  3306, // MySQL
  5432, // PostgreSQL
  6379, // Redis
  27017, // MongoDB
]

/**
 * Validates if a hostname is safe for outbound requests
 * @param hostname The hostname to validate
 * @param port Optional port number
 * @returns true if hostname is safe, false otherwise
 */
export function isHostnameSafe(hostname: string, port?: number): boolean {
  if (!hostname) return false

  const normalizedHostname = hostname.toLowerCase().trim()

  // Check against blocked patterns
  for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
    if (pattern.test(normalizedHostname)) {
      return false
    }
  }

  // Check blocked ports
  if (port && BLOCKED_PORTS.includes(port)) {
    return false
  }

  // Additional checks for IP addresses
  if (isIPAddress(normalizedHostname) && isPrivateIP(normalizedHostname)) {
    return false
  }

  return true
}

/**
 * Checks if a string is an IP address
 */
function isIPAddress(hostname: string): boolean {
  // Simple IPv4 check
  const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  if (ipv4Regex.test(hostname)) {
    return true
  }

  // Simple IPv6 check
  const ipv6Regex = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i
  if (ipv6Regex.test(hostname)) {
    return true
  }

  return false
}

/**
 * Checks if an IP address is in a private range
 */
function isPrivateIP(ip: string): boolean {
  const parts = ip.split(".").map(Number)

  // Invalid IPv4
  if (parts.length !== 4 || parts.some((part) => part < 0 || part > 255)) {
    return false
  }

  const [a, b] = parts

  // Private ranges
  if (a === 10) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 127) return true // Loopback
  if (a === 169 && b === 254) return true // Link-local

  return false
}

/**
 * Validates if a hostname is allowed for favicon fetching
 * Uses a blacklist approach - blocks dangerous internal/private networks but allows public domains
 */
export function isAllowedForFavicon(hostname: string): boolean {
  if (!hostname) return false

  const normalizedHostname = hostname.toLowerCase().trim()

  // Use the general hostname safety check which blocks:
  // - Private IP ranges (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
  // - Localhost/loopback addresses
  // - Link-local addresses
  // - Internal/metadata services
  // - Common internal domains (.local, .internal, etc.)
  return isHostnameSafe(normalizedHostname)
}
