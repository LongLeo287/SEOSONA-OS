import { NextRequest, NextResponse } from "next/server"
import { assertPersonByEmail } from "@/lib/attio"

const ATTIO_API_URL = "https://api.attio.com/v2"
const ATTIO_TOKEN = process.env.ATTIO_TOKEN

interface TypeformWebhookPayload {
  event_id: string
  event_type: string
  form_response: {
    form_id: string
    token: string
    submitted_at: string
    hidden?: {
      email?: string
      user_id?: string
      first_name?: string
    }
    answers?: Array<{
      type: string
      field: {
        id: string
        type: string
        ref?: string
      }
      [key: string]: any
    }>
    definition?: {
      fields?: Array<{
        id: string
        title: string
        type: string
        ref?: string
      }>
    }
  }
}

// Create or update User in Attio and link to Person
async function createOrUpdateUserInAttio(
  userId: string,
  email: string,
  firstName?: string,
  personRecordId?: string,
) {
  if (!ATTIO_TOKEN) return

  try {
    // Find existing User by user_id
    const existingUserRes = await fetch(
      `${ATTIO_API_URL}/objects/users/records/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ATTIO_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            filter: { user_id: userId },
            limit: 1,
          },
        }),
      },
    )

    const data: any = {
      user_id: userId,
      primary_email_address: [{ email_address: email }],
    }

    if (firstName) {
      data.username = firstName
    }

    // Link to Person if we have the record ID
    if (personRecordId) {
      data.person = [
        {
          target_object: "people",
          target_record_id: personRecordId,
        },
      ]
    }

    if (existingUserRes.ok) {
      const existingUserData = (await existingUserRes.json()) as any
      const existingUsers = existingUserData.data || []

      if (existingUsers.length > 0) {
        // Update existing User
        const userRecordId = existingUsers[0].id.record_id
        await fetch(`${ATTIO_API_URL}/objects/users/records/${userRecordId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ATTIO_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { values: data } }),
        })
        console.log(`✅ Updated User in Attio: ${userId}`)
        return userRecordId
      }
    }

    // Create new User
    const createRes = await fetch(`${ATTIO_API_URL}/objects/users/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ATTIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { values: data } }),
    })

    if (createRes.ok) {
      const result = (await createRes.json()) as any
      console.log(`✅ Created User in Attio: ${userId}`)
      return result.data?.id?.record_id
    }
  } catch (error) {
    console.error("Error creating/updating User in Attio:", error)
  }

  return null
}

// Find or create Person in Attio, then update status
async function updateAttioStatus(
  email: string,
  status: string,
  userDisplayName?: string,
  country?: string,
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
    let personExists = false

    if (queryResponse.ok) {
      const queryResult = (await queryResponse.json()) as any
      const people = queryResult.data || []
      if (people.length > 0) {
        personId = people[0]?.id?.record_id || null
        personExists = true
      }
    }

    // Update existing Person with country if provided
    if (personExists && personId && country) {
      console.log(`📍 Updating country for existing person: ${country}`)
      await fetch(`${ATTIO_API_URL}/objects/people/records/${personId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${ATTIO_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            values: {
              location: [
                {
                  country_code: country.toUpperCase(),
                  locality: country,
                },
              ],
            },
          },
        }),
      })
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

      if (country) {
        createData.location = [
          {
            country_code: country.toUpperCase(),
            locality: country,
          },
        ]
        console.log(`📍 Setting country: ${country}`)
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

    let entryId: string | null = null

    if (entriesResponse.ok) {
      const entriesResult = (await entriesResponse.json()) as any
      const entries = entriesResult.data || []
      entryId = entries[0]?.id?.entry_id || null
    }

    // Create list entry if not found
    let entryWasCreated = false
    if (!entryId) {
      console.log(`📝 Creating Partner Pipeline entry for person ${personId}`)

      const createEntryResponse = await fetch(
        `${ATTIO_API_URL}/lists/partner_pipeline/entries`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ATTIO_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              parent: { object: "people", record_id: personId },
              entry_values: {
                pipeline_status: status,
              },
            },
          }),
        },
      )

      if (createEntryResponse.ok) {
        const createEntryResult = (await createEntryResponse.json()) as any
        entryId = createEntryResult.data?.id?.entry_id
        entryWasCreated = true
        console.log(
          `✅ Created Pipeline Entry: ${entryId} with status "${status}"`,
        )
      } else {
        const errorText = await createEntryResponse.text()
        console.error(
          `❌ Failed to create entry: ${createEntryResponse.status} ${createEntryResponse.statusText}`,
        )
        console.error(`Error response:`, errorText)
      }
    } else {
      console.log(`ℹ️  Found existing Pipeline Entry: ${entryId}`)
    }

    if (!entryId) return

    // Update pipeline_status only if entry already existed
    if (!entryWasCreated) {
      console.log(`🔄 Updating pipeline status to "${status}"...`)
      const updateResponse = await fetch(
        `${ATTIO_API_URL}/lists/partner_pipeline/entries/${entryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ATTIO_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              entry_values: {
                pipeline_status: status,
              },
            },
          }),
        },
      )

      if (updateResponse.ok) {
        console.log(`✅ Updated pipeline status to "${status}" for ${email}`)
      } else {
        const errorText = await updateResponse.text()
        console.error(
          `❌ Failed to update status: ${updateResponse.status} ${updateResponse.statusText}`,
        )
        console.error(`Error response:`, errorText)
      }
    } else {
      console.log(`ℹ️  Skipping update - status already set during creation`)
    }
  } catch (error) {
    console.error("Error updating Attio status:", error)
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("🎯 Typeform webhook received")

    // Parse payload
    let payload: TypeformWebhookPayload
    try {
      payload = await req.json()
    } catch (error) {
      console.error("❌ Invalid JSON payload:", error)
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      )
    }

    const { event_type, form_response } = payload

    console.log(`📋 Event type: ${event_type}`)
    console.log(`📝 Form ID: ${form_response.form_id}`)

    // Only process form_response events
    if (event_type !== "form_response") {
      console.log(`⏭️  Ignoring event type: ${event_type}`)
      return NextResponse.json({
        message: `Ignored event type: ${event_type}`,
      })
    }

    // Extract hidden fields (user data)
    const hidden = form_response.hidden || {}
    const email = hidden.email
    const userId = hidden.user_id
    const firstName = hidden.first_name

    console.log(`📧 Email: ${email}`)
    console.log(`👤 User ID: ${userId}`)
    console.log(`👋 First name: ${firstName}`)

    if (!email) {
      console.error("❌ No email found in webhook payload")
      return NextResponse.json(
        { error: "No email found in webhook payload" },
        { status: 400 },
      )
    }

    // Extract country from form answers (text field with title "Country")
    let country: string | undefined

    // Build a map of field refs to titles for better field identification
    const fieldRefToTitle = new Map<string, string>()
    if (form_response.definition?.fields) {
      form_response.definition.fields.forEach((field) => {
        if (field.ref) {
          fieldRefToTitle.set(field.ref, field.title.toLowerCase())
        }
      })
    }

    if (form_response.answers && form_response.answers.length > 0) {
      console.log("📝 Form answers:")
      form_response.answers.forEach((answer, index) => {
        console.log(`  ${index + 1}. ${answer.type}:`, answer)

        // Look for country field by checking field title
        if (answer.type === "text" && answer.text && answer.field?.ref) {
          const fieldTitle = fieldRefToTitle.get(answer.field.ref)
          if (fieldTitle?.includes("country")) {
            country = answer.text
            console.log(`🌍 Found country field: ${country}`)
          }
        }
      })
    }

    try {
      // Create/update person in Attio
      const personRecordId = await assertPersonByEmail({
        email,
        firstName: firstName || undefined,
      })

      // Create/update user in Attio and link to Person
      if (userId && personRecordId) {
        await createOrUpdateUserInAttio(
          userId,
          email,
          firstName,
          personRecordId,
        )
      }

      // Update status to "Applied" with country info
      await updateAttioStatus(email, "Applied", firstName || undefined, country)

      console.log(`✅ Successfully processed application for ${email}`)

      return NextResponse.json({
        message: "Application processed successfully",
        email,
        status: "Applied",
      })
    } catch (error) {
      console.error("❌ Error processing application:", error)
      return NextResponse.json(
        {
          error: "Error processing application",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    message: "Typeform webhook endpoint is ready",
  })
}
