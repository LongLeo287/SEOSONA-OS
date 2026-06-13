#!/usr/bin/env tsx

/**
 * Comprehensive migration script to export ALL authors/partners data from 21st.dev to Attio CRM
 *
 * This script:
 * 1. Fetches all users who have published components (not manually added)
 * 2. Gets complete user profile data from Clerk API
 * 3. Calculates comprehensive statistics (components, demos, analytics, payouts)
 * 4. Gets subscription and plan information
 * 5. Creates/updates Person records in Attio with ALL available data
 * 6. Adds them to appropriate lists with detailed statuses
 */

import { PrismaClient } from "../prisma/client"
import { clerkClient } from "@clerk/nextjs/server"
import fetch from "node-fetch"

// Attio API configuration
const ATTIO_API_URL = "https://api.attio.com/v2"
const ATTIO_TOKEN = process.env.ATTIO_TOKEN

if (!ATTIO_TOKEN) {
  throw new Error("ATTIO_TOKEN environment variable is required")
}

const prisma = new PrismaClient()

// Comprehensive types for our migration
interface FullAuthorData {
  // Basic user info
  id: string
  email: string
  name: string | null
  username: string | null
  display_name: string | null
  display_username: string | null
  bio: string | null
  role: string | null

  // Images and media
  image_url: string | null
  display_image_url: string | null

  // Social links
  twitter_url: string | null
  github_url: string | null
  website_url: string | null

  // Dates
  created_at: Date
  updated_at: Date | null

  // Status flags
  manually_added: boolean
  is_partner: boolean | null

  // Financial
  stripe_id: string | null
  bundles_fee: number

  // Stats from DB
  components_count: number
  public_components_count: number

  // Payout information
  total_payouts: number
  pending_payouts: number
  last_payout_date: Date | null
  payout_status: "none" | "pending" | "processed" | "failed"

  // Activity stats (kept locally if needed, not sent to Attio)

  // Advanced analytics (not requested)

  // Clerk data (will be populated separately)
  clerk_data?: {
    phone_numbers?: string[]
    external_accounts?: {
      provider: string
      email?: string
      username?: string
    }[]
    public_metadata?: Record<string, any>
    private_metadata?: Record<string, any>
    unsafe_metadata?: Record<string, any>
    last_sign_in_at?: Date
    created_at_clerk?: Date
    updated_at_clerk?: Date
    profile_image_url?: string
    has_image?: boolean
  }
}

interface ComprehensiveAttioData {
  // Standard Attio fields (correct API format)
  email_addresses: Array<{ email_address: string }>
  name?: Array<{ first_name: string; last_name: string; full_name: string }>
  phone_numbers?: Array<{
    original_phone_number: string
    country_code?: string
  }>
  twitter?: Array<{ value: string }>

  // Custom fields - Basic Info
  username?: string
  display_name?: string
  display_username?: string
  bio?: string
  role?: string

  // Note: avatar_url cannot be set via API according to Attio docs

  // Custom fields - Social
  github_username?: string
  twitter_handle?: string

  // Custom fields - Platform Stats
  components_count: number
  public_components_count: number

  // Status handled at List Entry level, not People level

  // Custom fields - Financial
  bundles_fee: number
  total_payouts?: number
  pending_payouts?: number
  last_payout_date?: string
  payout_status?: string

  // (Removed activity counters as not needed for partner pipeline)

  // Custom fields - Advanced Analytics (removed)

  // Custom fields - Dates
  joined_at: string
  last_updated: string

  // Custom fields - Referral (removed)
}

// Helper functions
function extractTwitterData(twitterUrl: string | null): {
  handle?: string
  url?: string
} {
  if (!twitterUrl) return {}
  const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^/?]+)/)
  const handle = match?.[1]
  return {
    handle: handle,
    url: twitterUrl,
  }
}

function extractGithubData(githubUrl: string | null): {
  username?: string
  url?: string
} {
  if (!githubUrl) return {}
  const match = githubUrl.match(/github\.com\/([^/?]+)/)
  const username = match?.[1]
  return {
    username: username,
    url: githubUrl,
  }
}

function splitName(fullName: string | null): {
  firstName?: string
  lastName?: string
} {
  if (!fullName) return {}
  const parts = fullName.trim().split(" ")
  if (parts.length === 1) {
    return { firstName: parts[0] }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

function calculateStatus(
  author: FullAuthorData,
): "New" | "Eligible" | "Applied" | "Approved" | "Active" | "Declined" {
  // Only New / Eligible are auto-computed here; Applied/Approved/Active handled via List Entry
  if (author.public_components_count >= 5) return "Eligible"
  return "New"
}

// partner_state removed from People payload; stage logic is tracked at List Entry level

// User role classification removed from Attio payload; can be computed on-demand if needed

// Clerk API integration
async function fetchClerkUserData(
  userId: string,
): Promise<FullAuthorData["clerk_data"]> {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    const userAny = user as any

    return {
      phone_numbers:
        userAny.phoneNumbers?.map((phone: any) => phone.phoneNumber) || [],
      external_accounts:
        userAny.externalAccounts?.map((account: any) => ({
          provider: account.provider,
          email: account.emailAddress || undefined,
          username: account.username || undefined,
        })) || [],
      public_metadata: userAny.publicMetadata || {},
      private_metadata: userAny.privateMetadata || {},
      unsafe_metadata: userAny.unsafeMetadata || {},
      last_sign_in_at: userAny.lastSignInAt
        ? new Date(userAny.lastSignInAt)
        : undefined,
      created_at_clerk: new Date(userAny.createdAt),
      updated_at_clerk: new Date(userAny.updatedAt),
      profile_image_url:
        userAny.profileImageUrl || userAny.imageUrl || undefined,
      has_image: userAny.hasImage || false,
    }
  } catch (error) {
    console.warn(`Failed to fetch Clerk data for user ${userId}:`, error)
    return undefined
  }
}

// Comprehensive data fetching function
async function fetchFullAuthorsData(): Promise<FullAuthorData[]> {
  console.log("📊 Fetching authors data...")

  const query = `
    SELECT 
      u.id,
      u.email,
      u.name,
      u.username,
      u.display_name,
      u.display_username,
      u.bio,
      u.role,
      u.image_url,
      u.display_image_url,
      u.twitter_url,
      u.github_url,
      u.website_url,
      u.created_at,
      u.updated_at,
      u.manually_added,
      u.is_partner,
      u.stripe_id,
      u.bundles_fee,
      
      -- Component statistics
      COUNT(DISTINCT c.id) as components_count,
      COUNT(DISTINCT CASE WHEN c.is_public = true THEN c.id END) as public_components_count,
      
      -- Payout information
      COALESCE(payout_summary.total_payouts, 0) as total_payouts,
      COALESCE(payout_summary.pending_payouts, 0) as pending_payouts,
      payout_summary.last_payout_date,
      CASE 
        WHEN payout_summary.total_payouts > 0 THEN 'processed'::text
        WHEN payout_summary.pending_payouts > 0 THEN 'pending'::text
        ELSE 'none'::text
      END as payout_status
      
    FROM users u
    LEFT JOIN components c ON u.id = c.user_id
    LEFT JOIN (
      SELECT 
        ap.author_id,
        SUM(CASE WHEN ap.status = 'paid' THEN ap.total_amount ELSE 0 END) as total_payouts,
        SUM(CASE WHEN ap.status = 'pending' THEN ap.total_amount ELSE 0 END) as pending_payouts,
        MAX(ap.processed_at) as last_payout_date
      FROM author_payouts ap 
      GROUP BY ap.author_id
    ) payout_summary ON u.id = payout_summary.author_id
    
    WHERE 
      u.manually_added = false 
      AND u.is_admin = false
      AND u.email IS NOT NULL 
      AND u.email != ''
    GROUP BY 
      u.id, u.email, u.name, u.username, u.display_name, u.display_username, u.bio, u.role,
      u.image_url, u.display_image_url, u.twitter_url, u.github_url, 
      u.website_url, u.created_at, u.updated_at, u.manually_added, 
      u.is_partner, u.stripe_id, u.bundles_fee,
      payout_summary.total_payouts, payout_summary.pending_payouts, 
      payout_summary.last_payout_date
    HAVING COUNT(DISTINCT c.id) > 0
    ORDER BY components_count DESC
  `

  const result = await prisma.$queryRawUnsafe<any[]>(query)

  return result.map((row: any) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.username,
    display_name: row.display_name,
    display_username: row.display_username,
    bio: row.bio,
    role: row.role,
    image_url: row.image_url,
    display_image_url: row.display_image_url,
    twitter_url: row.twitter_url,
    github_url: row.github_url,
    website_url: row.website_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    manually_added: row.manually_added,
    is_partner: row.is_partner,
    stripe_id: row.stripe_id,
    bundles_fee: parseFloat(row.bundles_fee || "0"),
    components_count: parseInt(row.components_count || "0"),
    public_components_count: parseInt(row.public_components_count || "0"),
    total_payouts: parseFloat(row.total_payouts || "0"),
    pending_payouts: parseFloat(row.pending_payouts || "0"),
    last_payout_date: row.last_payout_date,
    payout_status: row.payout_status as FullAuthorData["payout_status"],
    // Default values for fields not in query
    api_keys_count: 0,
    magic_projects_count: 0,
    collections_count: 0,
    templates_count: 0,
    sandboxes_count: 0,
  }))
}

// Transform to comprehensive Attio data
function transformToComprehensiveAttioData(
  author: FullAuthorData,
): ComprehensiveAttioData {
  const { firstName, lastName } = splitName(author.display_name || author.name)
  const twitterData = extractTwitterData(author.twitter_url)
  const githubData = extractGithubData(author.github_url)

  const data: any = {
    // Standard Attio fields (correct API format)
    email_addresses: [{ email_address: author.email }],
  }

  // Add optional standard fields
  if (author.display_name || author.name) {
    data.name = [
      {
        first_name: firstName || "",
        last_name: lastName || "",
        full_name: author.display_name || author.name || "",
      },
    ]
  }

  if (author.clerk_data?.phone_numbers?.filter((p) => p).length) {
    data.phone_numbers = author.clerk_data.phone_numbers
      .filter((p) => p)
      .map((phone) => ({
        original_phone_number: phone,
      }))
  }

  if (twitterData.handle) {
    data.twitter = [{ value: twitterData.handle }]
  }

  // Add custom fields only if they have values
  if (author.username) data.username = author.username
  if (author.display_name) data.display_name = author.display_name
  if (author.display_username) data.display_username = author.display_username
  if (author.bio) data.bio = author.bio
  if (author.role) data.role = author.role
  if (githubData.username) data.github_username = githubData.username
  if (twitterData.handle) data.twitter_handle = twitterData.handle

  // Always add stats
  data.components_count = author.components_count
  data.public_components_count = author.public_components_count
  data.bundles_fee = author.bundles_fee

  // Add financial data if exists
  if (author.total_payouts > 0) data.total_payouts = author.total_payouts
  if (author.pending_payouts > 0) data.pending_payouts = author.pending_payouts
  if (author.last_payout_date)
    data.last_payout_date = author.last_payout_date.toISOString().split("T")[0]
  if (author.payout_status !== "none") data.payout_status = author.payout_status

  // Always add dates
  data.joined_at = author.created_at.toISOString().split("T")[0]
  data.last_updated = (author.updated_at || author.created_at)
    .toISOString()
    .split("T")[0]

  return data as ComprehensiveAttioData
}

// Assert person using Attio's upsert endpoint (PUT with query param)
async function assertPersonInAttio(
  data: ComprehensiveAttioData,
): Promise<string> {
  const response = await fetch(
    `${ATTIO_API_URL}/objects/people/records?matching_attribute=email_addresses`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ATTIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          values: data,
        },
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to assert person in Attio: ${response.status} ${errorText}`,
    )
  }

  const result = (await response.json()) as any
  return result.data?.id?.record_id || result.data?.record_id || result.data?.id
}

// Create list entry in Partner Pipeline, avoiding duplicates, and set list-level stage
const existingListParentIdsByList: Map<string, Set<string>> = new Map()

async function preloadExistingEntries(listId: string): Promise<void> {
  if (existingListParentIdsByList.has(listId)) return
  const parentIds = new Set<string>()
  // Fetch up to 2000 entries to cover current scale
  const response = await fetch(
    `${ATTIO_API_URL}/lists/${listId}/entries/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ATTIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { limit: 2000 } }),
    },
  )
  if (response.ok) {
    const json = (await response.json()) as any
    const entries: any[] = json?.data || []
    for (const e of entries) parentIds.add(e.parent_record_id)
  }
  existingListParentIdsByList.set(listId, parentIds)
}

async function addOrGetListEntry(params: {
  listId: string
  personRecordId: string
  status?: string
}): Promise<string | undefined> {
  await preloadExistingEntries(params.listId)
  const known = existingListParentIdsByList.get(params.listId)!
  if (known.has(params.personRecordId)) {
    return undefined
  }

  const response = await fetch(
    `${ATTIO_API_URL}/lists/${params.listId}/entries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ATTIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          parent_object: "people",
          parent_record_id: params.personRecordId,
          // Use pipeline_stage attribute for kanban
          entry_values: params.status ? { pipeline_stage: params.status } : {},
        },
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create list entry: ${response.status} ${errorText}`,
    )
  }

  const result = (await response.json()) as any
  known.add(params.personRecordId)
  return result.data.entry_id
}

// Resolve Partner Pipeline list id: prefer env, else lookup by name
async function resolvePartnerListId(): Promise<string> {
  const direct = process.env.ATTIO_PARTNER_LIST_ID
  if (direct && direct.trim()) return direct.trim()

  const desiredName = process.env.ATTIO_PARTNER_LIST_NAME || "Partner Pipeline"

  const response = await fetch(`${ATTIO_API_URL}/lists`, {
    method: "GET",
    headers: { Authorization: `Bearer ${ATTIO_TOKEN}` },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch lists: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as any
  const lists: Array<{
    id: any
    api_slug: string
    name?: string
    title?: string
  }> = data?.data || []
  const found = lists.find(
    (l) =>
      (l.name || l.title || "").toLowerCase() === desiredName.toLowerCase(),
  )
  if (!found) {
    throw new Error(
      `Partner list not found. Set ATTIO_PARTNER_LIST_ID or create list named "${desiredName}"`,
    )
  }
  return found.api_slug || found.id?.api_slug || found.id?.list_id || found.id
}

// Main migration function
async function migrateAuthorsToAttio() {
  console.log("🚀 Starting migration of authors to Attio...")

  try {
    // Fetch comprehensive authors data
    const authors = await fetchFullAuthorsData()
    console.log(`✅ Found ${authors.length} authors to migrate`)

    // Enhanced statistics
    const stats = {
      total: authors.length,
      withComponents: authors.filter((a) => a.components_count > 0).length,
      eligible: authors.filter((a) => a.public_components_count >= 5).length,
      partners: authors.filter((a) => a.is_partner).length,
      withPayouts: authors.filter((a) => a.total_payouts > 0).length,
      powerUsers: authors.filter((a) => a.components_count >= 10).length,
    }

    console.log(`\n📈 Migration Statistics:`)
    console.log(`  Total authors: ${stats.total}`)
    console.log(`  With components: ${stats.withComponents}`)
    console.log(`  Eligible (5+ public): ${stats.eligible}`)
    console.log(`  Current partners: ${stats.partners}`)
    console.log(`  With payouts: ${stats.withPayouts}`)
    console.log(`  Power users (10+): ${stats.powerUsers}`)

    // Resolve Partner Pipeline list once and preload entries
    console.log("🔍 Resolving Partner Pipeline list...")
    const partnerListId = await resolvePartnerListId()
    console.log(`✅ Using Partner Pipeline list: ${partnerListId}`)
    await preloadExistingEntries(partnerListId)

    // Process each author with Clerk data
    let successCount = 0
    let errorCount = 0

    for (const [index, author] of authors.entries()) {
      try {
        console.log(
          `\n[${index + 1}/${authors.length}] Processing ${author.display_name || author.name || author.username} (${author.email})`,
        )

        // Fetch Clerk data
        console.log(`  🔍 Fetching Clerk data...`)
        author.clerk_data = await fetchClerkUserData(author.id)

        // Log comprehensive stats
        console.log(
          `  📊 Stats: ${author.components_count} total (${author.public_components_count} public) | ` +
            `💰$${author.total_payouts} | ` +
            `${author.is_partner ? "🤝Partner" : author.public_components_count >= 5 ? "✅Eligible" : "🆕New"}`,
        )

        const attioData = transformToComprehensiveAttioData(author)

        // Create/update person in Attio using Assert endpoint
        const recordId = await assertPersonInAttio(attioData)
        console.log(`  ✅ Person asserted in Attio: ${recordId}`)

        // Add to Partner Pipeline list, avoid duplicates. Stage will be synced later.
        await addOrGetListEntry({
          listId: partnerListId,
          personRecordId: recordId,
        })
        console.log(`  📋 Ensured in Partner Pipeline list`)
        // if (attioData.user_role_category === 'power_user') await addPersonToList(recordId, 'power-users-list-id')

        successCount++

        // Rate limiting - wait 100ms between requests
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`  ❌ Error processing ${author.email}:`, error)
        errorCount++
        continue
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`  ✅ Successful: ${successCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
  } catch (error) {
    console.error("💥 Migration failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Enhanced dry run function
async function dryRun() {
  console.log("🧪 Running dry run (no data will be sent to Attio)...")

  try {
    const authors = await fetchFullAuthorsData()

    console.log(`\n📊 Dry Run Results:`)
    console.log(`Total authors found: ${authors.length}\n`)

    // Show detailed examples
    const samples = authors.slice(0, 3)
    for (const [index, author] of samples.entries()) {
      // Fetch Clerk data for sample
      author.clerk_data = await fetchClerkUserData(author.id)
      const attioData = transformToComprehensiveAttioData(author)

      console.log(
        `${index + 1}. ${author.display_name || author.name || author.username} (${author.email})`,
      )
      console.log(
        `   🏷️  Basic: ${author.username} | ${author.role || "No role"}`,
      )
      console.log(
        `   📊 Activity: ${author.components_count} total (${author.public_components_count} public)`,
      )
      console.log(
        `   💰 Financial: $${author.total_payouts} paid, $${author.pending_payouts} pending`,
      )
      console.log(
        `   🔗 Social: ${attioData.twitter_handle || "No Twitter"} | ${attioData.github_username || "No GitHub"}`,
      )
      console.log(
        `   📱 Clerk: ${author.clerk_data?.phone_numbers?.length || 0} phones, ${author.clerk_data?.external_accounts?.length || 0} accounts`,
      )
      const status = calculateStatus(author)
      console.log(`   🎯 Classification: ${status}`)
      console.log(
        `   📅 Dates: Joined ${author.created_at.toLocaleDateString()} | Last activity ${(author.updated_at || author.created_at).toLocaleDateString()}`,
      )
      console.log("")
    }

    if (authors.length > 3) {
      console.log(`... and ${authors.length - 3} more authors`)
    }

    // Comprehensive statistics
    const statusStats = {
      new: authors.filter((a) => calculateStatus(a) === "New").length,
      eligible: authors.filter((a) => calculateStatus(a) === "Eligible").length,
    }

    console.log(`\n📈 Status Distribution:`)
    console.log(`  New: ${statusStats.new}`)
    console.log(`  Eligible: ${statusStats.eligible}`)

    // Data completeness analysis
    const completeness = {
      hasDisplayName: authors.filter((a) => a.display_name).length,
      hasBio: authors.filter((a) => a.bio).length,
      hasTwitter: authors.filter((a) => a.twitter_url).length,
      hasGithub: authors.filter((a) => a.github_url).length,
      hasWebsite: authors.filter((a) => a.website_url).length,
      hasRole: authors.filter((a) => a.role).length,
    }

    console.log(`\n📋 Data Completeness:`)
    console.log(
      `  Display Name: ${completeness.hasDisplayName}/${authors.length} (${Math.round((completeness.hasDisplayName / authors.length) * 100)}%)`,
    )
    console.log(
      `  Bio: ${completeness.hasBio}/${authors.length} (${Math.round((completeness.hasBio / authors.length) * 100)}%)`,
    )
    console.log(
      `  Twitter: ${completeness.hasTwitter}/${authors.length} (${Math.round((completeness.hasTwitter / authors.length) * 100)}%)`,
    )
    console.log(
      `  GitHub: ${completeness.hasGithub}/${authors.length} (${Math.round((completeness.hasGithub / authors.length) * 100)}%)`,
    )
    console.log(
      `  Website: ${completeness.hasWebsite}/${authors.length} (${Math.round((completeness.hasWebsite / authors.length) * 100)}%)`,
    )
    console.log(
      `  Role: ${completeness.hasRole}/${authors.length} (${Math.round((completeness.hasRole / authors.length) * 100)}%)`,
    )
  } catch (error) {
    console.error("💥 Dry run failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2)

  if (args.includes("--dry-run")) {
    await dryRun()
  } else {
    console.log("⚠️  This will migrate authors data to Attio.")
    console.log(
      "⚠️  Make sure you have set up required custom attributes in Attio first.",
    )
    console.log("⚠️  Required env vars: ATTIO_TOKEN, ADMIN_USER_ID")
    console.log("")

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const answer = await new Promise<string>((resolve) => {
      readline.question("Continue with migration to Attio? (y/N): ", resolve)
    })

    readline.close()

    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      await migrateAuthorsToAttio()
    } else {
      console.log("Migration cancelled.")
    }
  }
}

if (require.main === module) {
  main().catch(console.error)
}
