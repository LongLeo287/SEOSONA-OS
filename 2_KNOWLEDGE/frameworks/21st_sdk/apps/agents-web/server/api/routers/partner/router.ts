import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc"

const ATTIO_API_URL = "https://api.attio.com/v2"
const ATTIO_TOKEN = process.env.ATTIO_TOKEN

// Find or create Person in Attio, then update status
async function updateAttioStatus(
  email: string,
  status: string,
  userDisplayName?: string,
) {
  if (!ATTIO_TOKEN) return

  try {
    // Find People record by email
    const queryResponse = await fetch(
      `${ATTIO_API_URL}/objects/people/records/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ATTIO_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            filter: {
              email_addresses: { email_address: email },
            },
            limit: 1,
          },
        }),
      },
    )

    let personId: string | null = null

    if (queryResponse.ok) {
      const queryResult = (await queryResponse.json()) as any
      const people = queryResult.data || []
      personId = people[0]?.id?.record_id || null
    }

    // Create Person if not found
    if (!personId) {
      console.log(`Creating new Person for ${email}`)

      const createData: any = {
        email_addresses: [{ email_address: email }],
      }

      if (userDisplayName) {
        const nameParts = userDisplayName.trim().split(" ")
        createData.name = [
          {
            first_name: nameParts[0] || "",
            last_name: nameParts.slice(1).join(" ") || "",
            full_name: userDisplayName,
          },
        ]
      }

      const createResponse = await fetch(
        `${ATTIO_API_URL}/objects/people/records?matching_attribute=email_addresses`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ATTIO_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { values: createData },
          }),
        },
      )

      if (createResponse.ok) {
        const createResult = (await createResponse.json()) as any
        personId = createResult.data?.id?.record_id
        console.log(`✅ Created Person: ${personId}`)
      }
    }

    if (!personId) return

    // Find Partner Pipeline list entry
    const entriesResponse = await fetch(
      `${ATTIO_API_URL}/lists/partner_pipeline/entries/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ATTIO_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            filter: {
              parent_record_id: personId,
            },
            limit: 1,
          },
        }),
      },
    )

    if (!entriesResponse.ok) return

    const entriesResult = (await entriesResponse.json()) as any
    const entries = entriesResult.data || []
    if (entries.length === 0) return

    const entryId = entries[0]?.id?.entry_id
    if (!entryId) return

    // Update entry status
    await fetch(`${ATTIO_API_URL}/lists/partner_pipeline/entries/${entryId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ATTIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          entry_values: { pipeline_status: status },
        },
      }),
    })

    console.log(`✅ Updated Attio status for ${email} to ${status}`)
  } catch (error) {
    console.error("Failed to update Attio status:", error)
  }
}

export const partnerRouter = createTRPCRouter({
  // Read partner pipeline status from Attio by email (own status or admin only)
  getPartnerStatus: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      // Check if user is admin or requesting their own status
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.auth.userId! },
        select: { email: true, is_admin: true },
      })

      if (!user) {
        throw new Error("User not found")
      }

      // Only allow admin or own email
      if (!user.is_admin && user.email !== input.email) {
        throw new Error("Access denied: can only view own partner status")
      }
      try {
        if (!ATTIO_TOKEN) return null

        // Find People record by email
        const personRes = await fetch(
          `${ATTIO_API_URL}/objects/people/records/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ATTIO_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                filter: { email_addresses: { email_address: input.email } },
                limit: 1,
              },
            }),
          },
        )
        if (!personRes.ok) return null
        const personData = (await personRes.json()) as any
        const personId = personData?.data?.[0]?.id?.record_id
        if (!personId) return null

        // Get pipeline entry
        const entryRes = await fetch(
          `${ATTIO_API_URL}/lists/partner_pipeline/entries/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ATTIO_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: { filter: { parent_record_id: personId }, limit: 1 },
            }),
          },
        )
        if (!entryRes.ok) return null
        const entryData = (await entryRes.json()) as any
        const entry = entryData?.data?.[0]
        const statusTitle =
          entry?.entry_values?.pipeline_status?.[0]?.option?.title || null
        return statusTitle as
          | "New"
          | "Eligible"
          | "Applied"
          | "Approved"
          | "Contract Sent"
          | "Active"
          | "Archived"
          | "Declined"
          | null
      } catch (e) {
        console.error("getPartnerStatus failed", e)
        return null
      }
    }),
})
