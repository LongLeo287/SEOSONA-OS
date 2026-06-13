const DEFAULT_STUDIO_WIZARD_SLUG = "builder"

export function getStudioWizardSlug(): string {
  const slug = process.env.BUILDER_WIZARD_SLUG?.trim()
  return slug && slug.length > 0 ? slug : DEFAULT_STUDIO_WIZARD_SLUG
}

export function getStudioWizardApiKey(): string | null {
  const apiKey = process.env.BUILDER_WIZARD_API_KEY?.trim() || process.env.AN_API_KEY?.trim()
  return apiKey && apiKey.length > 0 ? apiKey : null
}
