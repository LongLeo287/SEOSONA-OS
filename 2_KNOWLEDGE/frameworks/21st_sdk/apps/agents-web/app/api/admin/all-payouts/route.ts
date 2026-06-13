import { checkIsAdmin, supabaseWithAdminAccess } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isAdmin, error: isAdminError } = await checkIsAdmin(userId)
    if (isAdminError) {
      console.error("Error checking is admin:", isAdminError)
      return NextResponse.json(
        { error: "Failed to check is admin" },
        { status: 500 },
      )
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const searchParams = url.searchParams

    // Get parameters
    const page = parseInt(searchParams.get("page") || "0")
    const limit = parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Calculate offset
    const offset = page * limit

    // Build query for payouts
    let query = supabaseWithAdminAccess.from("author_payouts").select(`
        id,
        period_start,
        period_end,
        total_amount,
        total_usage,
        paypal_email,
        status,
        transaction_id,
        created_at,
        processed_at,
        author_id
      `)

    // Apply status filter
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    // Apply sorting
    const validSortColumns = [
      "created_at",
      "period_start",
      "total_amount",
      "status",
    ]
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at"
    const order = sortOrder === "asc" ? true : false

    query = query.order(sortColumn, { ascending: order })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: payouts, error: payoutsError } = await query

    if (payoutsError) {
      console.error("Error fetching payouts:", payoutsError)
      return NextResponse.json(
        { error: "Failed to fetch payouts" },
        { status: 500 },
      )
    }

    // Get unique user IDs
    const userIds = [...new Set(payouts?.map((p) => p.author_id) || [])]

    // Fetch user data separately
    const { data: users, error: usersError } = await supabaseWithAdminAccess
      .from("users")
      .select(
        `
        id,
        username,
        display_username,
        name,
        display_name,
        email,
        image_url,
        display_image_url
      `,
      )
      .in("id", userIds)

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      )
    }

    // Create a map of users by ID for quick lookup
    const usersMap = new Map(users?.map((user) => [user.id, user]) || [])

    // Combine payouts with user data
    const payoutsWithUsers =
      payouts?.map((payout) => ({
        ...payout,
        users: usersMap.get(payout.author_id) || null,
      })) || []

    // Get total count for pagination
    let countQuery = supabaseWithAdminAccess
      .from("author_payouts")
      .select("id", { count: "exact", head: true })

    if (status && status !== "all") {
      countQuery = countQuery.eq("status", status)
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) {
      console.error("Error fetching count:", countError)
      return NextResponse.json(
        { error: "Failed to fetch count" },
        { status: 500 },
      )
    }

    const hasMore = offset + limit < (totalCount || 0)

    return NextResponse.json({
      payouts: payoutsWithUsers,
      totalCount: totalCount || 0,
      hasMore,
    })
  } catch (error) {
    console.error("All payouts error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
