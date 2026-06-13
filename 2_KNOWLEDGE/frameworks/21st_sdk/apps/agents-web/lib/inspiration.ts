export function generateAppSlug(domain: string, name?: string): string {
  // Use app name if provided, otherwise extract from domain
  const baseSlug = name
    ? name
    : domain.replace(/^https?:\/\//, "").replace(/^www\./, "")

  // Convert to lowercase and replace special characters with hyphens
  return baseSlug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
