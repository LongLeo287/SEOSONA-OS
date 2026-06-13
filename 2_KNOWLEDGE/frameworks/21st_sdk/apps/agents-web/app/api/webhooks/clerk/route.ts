import { WebhookEvent } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { Webhook, WebhookRequiredHeaders } from "svix"
import { prisma } from "@/lib/prisma"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const generateUniqueUsername = async (username: string) => {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .or(`username.eq.${username},display_username.eq.${username}`)

  if (data && data.length > 0) {
    return `${username}_${crypto.randomUUID().slice(0, 8)}`
  }

  return username
}

// Get waitlist survey data by email (most recent entry)
const getWaitlistData = async (email: string) => {
  const { data } = await supabaseAdmin
    .from("waitlist")
    .select(
      "what_describes_you_best, what_describes_you_best_other, company_size",
    )
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function POST(req: Request) {
  const payload = await req.text()
  const headersList = req.headers

  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  }

  // Check if all required headers are present
  if (
    !heads["svix-id"] ||
    !heads["svix-timestamp"] ||
    !heads["svix-signature"]
  ) {
    return NextResponse.json(
      { error: "Missing required headers" },
      { status: 400 },
    )
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    )
  }

  const wh = new Webhook(webhookSecret)
  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, heads as WebhookRequiredHeaders) as WebhookEvent
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    )
  }

  const { type, data: user } = evt

  switch (type) {
    case "user.created":
    case "user.updated":
      try {
        let username: string | null = user.username
        let name: string | null =
          user.first_name || user.last_name
            ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
            : null
        const image_url = user.image_url

        for (const account of user.external_accounts) {
          username = username || account.username
          name =
            name ||
            (account.first_name || account.last_name
              ? `${account.first_name ?? ""} ${account.last_name ?? ""}`.trim()
              : null)
        }

        for (const email of user.email_addresses) {
          username = username || (email.email_address?.split("@")[0] ?? null)
        }

        for (const account of user.external_accounts) {
          username = username || (account.email_address?.split("@")[0] ?? null)
        }

        username = username || user.id
        username = await generateUniqueUsername(username)

        // For new users, initialize display fields with Clerk data
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()

        // For new users, check if they're in the waitlist and get survey data
        let waitlistData = null
        const userEmail = user.email_addresses[0]?.email_address
        if (!existingUser && userEmail) {
          waitlistData = await getWaitlistData(userEmail)
        }

        const userData = {
          id: user.id,
          image_url,
          email: userEmail ?? null,
          name,
          // Only set display fields for new users
          ...(existingUser
            ? {}
            : {
                name: name,
                username: username,
                display_name: name,
                display_username: username,
                display_image_url: image_url,
                // Copy survey data from waitlist if available
                ...(waitlistData
                  ? {
                      what_describes_you_best:
                        waitlistData.what_describes_you_best,
                      what_describes_you_best_other:
                        waitlistData.what_describes_you_best_other,
                      company_size: waitlistData.company_size,
                    }
                  : {}),
              }),
        }

        const { data, error } = await supabaseAdmin
          .from("users")
          .upsert(userData, { onConflict: "id" })

        if (error) {
          return NextResponse.json(
            { error: "Failed to sync user with Supabase", details: error },
            { status: 500 },
          )
        }

        // Setup for new users only
        if (type === "user.created" && !existingUser && userData.email) {
          try {
            // Link any pending team invitations to this user
            await supabaseAdmin
              .from("team_members")
              .update({ user_id: user.id })
              .eq("email", userData.email.toLowerCase())
              .is("user_id", null)

            // Create default team for new user
            try {
              const existingTeams = await prisma.team.count({
                where: { user_id: user.id },
              })

              if (existingTeams === 0) {
                await prisma.team.create({
                  data: {
                    name: "Personal Projects",
                    user_id: user.id,
                  },
                })
                console.log(`Created default team for user ${user.id}`)
              }
            } catch (teamError) {
              console.error("Failed to create default team:", teamError)
            }
          } catch (setupError) {
            // Log error but don't fail the webhook
            console.error("Failed to process new user setup:", setupError)
          }
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Unexpected error during user sync", details: error },
          { status: 500 },
        )
      }
      break

    case "user.deleted":
      // eslint-disable-next-line no-case-declarations
      const { error: deleteError } = await supabaseAdmin
        .from("users")
        .delete()
        .match({ id: user.id })

      if (deleteError) {
        return NextResponse.json(
          { error: "Failed to delete user from Supabase" },
          { status: 500 },
        )
      }
      break

    default:
  }
  return NextResponse.json({ message: "Webhook processed successfully" })
}

export async function GET() {
  return NextResponse.json({ message: "Clerk webhook endpoint" })
}
