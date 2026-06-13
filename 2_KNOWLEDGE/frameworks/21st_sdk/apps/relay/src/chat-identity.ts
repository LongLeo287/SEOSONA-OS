export class ExternalUserIdentityError extends Error {
  readonly status = 403

  constructor(message: string) {
    super(message)
    this.name = "ExternalUserIdentityError"
  }
}

function normalizeExternalUserId(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}

export function resolveTrustedExternalUserId(input: {
  tokenEndUserId?: string | null
  bodyExternalUserId?: string | null
}) {
  const tokenEndUserId = normalizeExternalUserId(input.tokenEndUserId)
  const bodyExternalUserId = normalizeExternalUserId(input.bodyExternalUserId)

  if (!tokenEndUserId) {
    return bodyExternalUserId
  }

  if (bodyExternalUserId && bodyExternalUserId !== tokenEndUserId) {
    throw new ExternalUserIdentityError(
      "externalUserId must match the authenticated token end_user_id",
    )
  }

  return tokenEndUserId
}
