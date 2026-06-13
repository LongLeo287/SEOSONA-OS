type TeamBillingReadiness =
  | { ready: true }
  | { ready: false; setupUrl?: string; blocker?: string }

const BILLING_SETUP_LOG_PREFIX = '[BILLING_SETUP]'
const IS_STANDALONE_APP = process.env.NEXT_PUBLIC_IS_STANDALONE_APP === 'true'

export async function ensureTeamBillingReady(
  teamId: string,
): Promise<TeamBillingReadiness> {
  const logTag = `${BILLING_SETUP_LOG_PREFIX}[team:${teamId}]`

  if (IS_STANDALONE_APP) {
    console.warn(`${logTag} Billing readiness check disabled in standalone app mode`)
    return { ready: true }
  }

  const baseUrl = process.env.BILLING_SETUP_BASE_URL?.trim()
  const internalToken = process.env.INTERNAL_API_SECRET?.trim()
  if (!baseUrl || !internalToken) {
    console.error(`${logTag} Billing readiness check blocked: BILLING_SETUP_BASE_URL or INTERNAL_API_SECRET missing`)
    return { ready: false, blocker: "missing_config" }
  }

  let response: Response
  try {
    response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/agents/billing/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-token": internalToken,
        },
        body: JSON.stringify({ teamId }),
      },
    )
  } catch (error) {
    console.error(`${logTag} Billing readiness check request failed`, error)
    return { ready: false, blocker: "billing_check_failed" }
  }

  if (!response.ok) {
    const rawBody = await response.text().catch(() => "")
    console.error(`${logTag} Billing readiness check returned non-OK response`, {
      status: response.status,
      statusText: response.statusText,
      body: rawBody.slice(0, 400),
    })
    return { ready: false, blocker: "billing_check_failed" }
  }

  let payload: Record<string, unknown>
  try {
    payload = (await response.json()) as Record<string, unknown>
  } catch (error) {
    console.error(`${logTag} Billing readiness response JSON parsing failed`, error)
    return { ready: false, blocker: "billing_check_failed" }
  }

  if (typeof payload.ready !== "boolean") {
    console.error(`${logTag} Billing readiness response missing 'ready' boolean`, payload)
    return { ready: false, blocker: "billing_check_failed" }
  }

  const blocker =
    typeof payload.blocker === "string" ? payload.blocker : undefined
  const isFreeWithoutBlocker =
    payload.plan_status === "free" && blocker === undefined

  if (payload.ready || isFreeWithoutBlocker) {
    console.log(`${logTag} Billing readiness passed`, {
      planStatus: payload.plan_status,
      blocker,
    })
    return { ready: true }
  }

  console.warn(`${logTag} Billing readiness failed`, {
    blocker,
    setupUrl:
      typeof payload.setup_url === "string" ? payload.setup_url : undefined,
    planStatus: payload.plan_status,
  })
  return {
    ready: false,
    setupUrl:
      typeof payload.setup_url === "string" ? payload.setup_url : undefined,
    blocker,
  }
}
