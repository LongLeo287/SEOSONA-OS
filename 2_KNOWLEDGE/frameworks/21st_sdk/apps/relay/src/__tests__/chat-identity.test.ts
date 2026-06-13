import { describe, expect, it } from "vitest"
import {
  resolveTrustedExternalUserId,
  ExternalUserIdentityError,
} from "../chat-identity"

describe("chat external user identity", () => {
  it("uses the token end_user_id when present", () => {
    expect(
      resolveTrustedExternalUserId({
        tokenEndUserId: "usr_token",
        bodyExternalUserId: undefined,
      }),
    ).toBe("usr_token")
  })

  it("rejects body externalUserId that differs from the token end_user_id", () => {
    expect(() =>
      resolveTrustedExternalUserId({
        tokenEndUserId: "usr_token",
        bodyExternalUserId: "usr_other",
      }),
    ).toThrow(ExternalUserIdentityError)
  })

  it("preserves API-key body externalUserId when no token end_user_id exists", () => {
    expect(
      resolveTrustedExternalUserId({
        tokenEndUserId: undefined,
        bodyExternalUserId: "usr_server",
      }),
    ).toBe("usr_server")
  })
})
