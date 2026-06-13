const DEEL_BASE =
  process.env.DEEL_API_BASE || "https://api.letsdeel.com/rest/v2"
const DEEL_TOKEN = process.env.DEEL_TOKEN || ""

export type CreatePaygInput = {
  contractorEmail: string
  firstName: string
  lastName: string
  countryCode?: string
  currency: string
  rateAmount: number
  rateUnit: "hour" | "task"
  name?: string
}

export type DeelContract = {
  id: string
  status: string
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${DEEL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${DEEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Deel ${path} failed ${res.status} ${text}`)
  }
  return res
}

export async function createPaygContract(
  input: CreatePaygInput,
): Promise<DeelContract> {
  const body = {
    type: "pay_as_you_go",
    name: input.name ?? "21st.dev Partner PAYG",
    team_id: "53dc65cd-e275-4bce-981e-7aac51696e91", // Partners team
    job_title: "Component Author",
    scope_of_work:
      "Publishing and improving UI components. Payment only for approved work.",
    currency: input.currency,
    rate: { amount: input.rateAmount, unit: input.rateUnit },
    contractor: (() => {
      const c: any = {
        email: input.contractorEmail,
        first_name: input.firstName,
        last_name: input.lastName,
      }
      if (input.countryCode) c.country = input.countryCode
      return c
    })(),
  }
  const res = await request("/contracts", {
    method: "POST",
    body: JSON.stringify(body),
  })
  return res.json() as Promise<DeelContract>
}

export async function getContract(contractId: string): Promise<DeelContract> {
  const res = await request(`/contracts/${contractId}`, { method: "GET" })
  return res.json() as Promise<DeelContract>
}
