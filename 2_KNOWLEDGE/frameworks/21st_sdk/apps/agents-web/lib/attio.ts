const ATTIO_BASE = process.env.ATTIO_API_BASE || "https://api.attio.com/v2"
const ATTIO_TOKEN = process.env.ATTIO_TOKEN || ""
const ATTIO_LIST_ID = process.env.ATTIO_PARTNER_LIST_ID || "partner_pipeline"

export type AttioStatus =
  | "New"
  | "Eligible"
  | "Applied"
  | "Approved"
  | "Contract Sent"
  | "Active"
  | "Archived"
  | "Declined"

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${ATTIO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ATTIO_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Attio ${path} failed ${res.status} ${text}`)
  }
  return res
}

export async function ensurePeopleAttribute(
  apiSlug: string,
  params: { title: string; description?: string; type?: "text" | "number" },
) {
  // 1) list existing attributes
  const list = await request(`/objects/people/attributes`, { method: "GET" })
  const listData = (await list.json()) as any
  const exists = (listData?.data || []).some((a: any) => a.api_slug === apiSlug)
  if (exists) return

  // 2) create attribute
  await request(`/objects/people/attributes`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        api_slug: apiSlug,
        type: params.type || "text",
        title: params.title,
        description: params.description || "",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
      },
    }),
  })
}

export async function assertPersonByEmail(input: {
  email: string
  firstName?: string
  lastName?: string
  country?: string
  countryCode?: string
  public_components_count?: number
  components_count?: number
  github?: string
  deel_contract_id?: string
}) {
  // Ensure custom attribute for Deel contract id exists on People
  if (input.deel_contract_id) {
    await ensurePeopleAttribute("deel_contract_id", {
      title: "Deel Contract ID",
      description: "Link to Deel contract id",
      type: "text",
    })
  }

  const values: any = {
    email_addresses: [{ email_address: input.email }],
    public_components_count: input.public_components_count,
    components_count: input.components_count,
    github: input.github,
    deel_contract_id: input.deel_contract_id,
  }

  // Set primary_location if country is provided
  if (input.country || input.countryCode) {
    values.primary_location = [
      {
        line_1: null,
        line_2: null,
        line_3: null,
        line_4: null,
        locality: null,
        region: null,
        postcode: null,
        country_code: input.countryCode || null,
        latitude: null,
        longitude: null,
      },
    ]
  }

  // Set name using proper Attio structure
  if (input.firstName || input.lastName) {
    values.name = [
      {
        first_name: input.firstName || "",
        last_name: input.lastName || "",
        full_name:
          `${input.firstName || ""} ${input.lastName || ""}`.trim() ||
          undefined,
      },
    ]
  }

  const res = await request(
    `/objects/people/records?matching_attribute=email_addresses`,
    {
      method: "PUT",
      body: JSON.stringify({
        data: { values },
      }),
    },
  )
  const data = (await res.json()) as { data?: { id?: { record_id?: string } } }
  return data?.data?.id?.record_id as string | undefined
}

export async function upsertListEntryByPerson(
  personRecordId: string,
  status: AttioStatus,
) {
  // Query for existing entry
  const q = await request(`/lists/${ATTIO_LIST_ID}/entries/query`, {
    method: "POST",
    body: JSON.stringify({
      data: { filter: { parent_record_id: personRecordId }, limit: 1 },
    }),
  })
  const qData = (await q.json()) as any
  const existing = qData?.data?.[0]
  if (existing?.id?.entry_id) {
    await request(`/lists/${ATTIO_LIST_ID}/entries/${existing.id.entry_id}`, {
      method: "PUT",
      body: JSON.stringify({
        data: { entry_values: { pipeline_status: status } },
      }),
    })
    return existing.id.entry_id as string
  }

  // Create new entry
  const res = await request(`/lists/${ATTIO_LIST_ID}/entries`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        parent: { object: "people", record_id: personRecordId },
        values: { pipeline_status: status },
      },
    }),
  })
  const data = (await res.json()) as { data?: { id?: { entry_id?: string } } }
  return data?.data?.id?.entry_id as string | undefined
}
