import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { stripeV1, stripeV2 } from "@/lib/stripe"
import { StripeService } from "@/server/api/routers/stripe/services/stripe.service"

export async function DELETE() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`[Account Deletion] Starting deletion for user: ${userId}`)

    // Step 1: Cancel any active Stripe subscription immediately
    try {
      const subscriptionInfo = await StripeService.getSubscriptionInfo(userId)
      const subscriptionId = subscriptionInfo?.subscriptionId

      if (subscriptionId) {
        const planVersion = subscriptionInfo.plan?.version || 1
        const stripeInstance = planVersion === 1 ? stripeV1 : stripeV2

        // Cancel immediately, not at period end
        await stripeInstance.subscriptions.cancel(subscriptionId)
        console.log(
          `[Account Deletion] Cancelled Stripe subscription: ${subscriptionId}`,
        )
      }
    } catch (stripeError) {
      // Log but continue - subscription might not exist or already be cancelled
      console.error(
        "[Account Deletion] Stripe cancellation error (continuing):",
        stripeError,
      )
    }

    // Step 2: Delete related data with onDelete: NoAction constraints
    // Order matters due to FK constraints - delete in dependency order

    try {
      // Get user's username for hunter relation cleanup
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      })

      // Nullify hunter_username on components where this user was the hunter
      // (these are components owned by OTHER users that this user "hunted")
      if (user?.username) {
        await prisma.component.updateMany({
          where: { hunter_username: user.username },
          data: { hunter_username: null },
        })
        console.log(
          `[Account Deletion] Cleared hunter references for user: ${userId}`,
        )
      }

      // Delete user's demos first (has FK to components)
      await prisma.demo.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted demos for user: ${userId}`)

      // Delete user's components (has FK to user)
      await prisma.component.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted components for user: ${userId}`)

      // Delete user's collections
      await prisma.collection.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted collections for user: ${userId}`)

      // Delete user's sandboxes
      await prisma.sandbox.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted sandboxes for user: ${userId}`)

      // Delete user's feedback
      await prisma.feedback.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted feedback for user: ${userId}`)

      // Delete user's component purchases
      await prisma.componentsPurchase.deleteMany({
        where: { user_id: userId },
      })
      console.log(
        `[Account Deletion] Deleted component purchases for user: ${userId}`,
      )

      // Delete user's bundle purchases
      await prisma.bundlePurchase.deleteMany({
        where: { user_id: userId },
      })
      console.log(
        `[Account Deletion] Deleted bundle purchases for user: ${userId}`,
      )

      // Delete user's referral payments
      await prisma.referralPayment.deleteMany({
        where: { user_id: userId },
      })
      console.log(
        `[Account Deletion] Deleted referral payments for user: ${userId}`,
      )

      // Delete plan info
      await prisma.usersToPlan.deleteMany({
        where: { user_id: userId },
      })
      console.log(`[Account Deletion] Deleted plan info for user: ${userId}`)
    } catch (dbError) {
      console.error("[Account Deletion] Database cleanup error:", dbError)
      // Continue to Clerk deletion even if some DB cleanup fails
      // The webhook will try to delete remaining data
    }

    // Step 3: Delete user from Clerk
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("[Account Deletion] CLERK_SECRET_KEY not set")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      )
    }

    const clerkDeleteResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!clerkDeleteResponse.ok) {
      const errorText = await clerkDeleteResponse.text()
      console.error("[Account Deletion] Clerk deletion failed:", errorText)

      // If user doesn't exist in Clerk, consider it a success
      if (clerkDeleteResponse.status === 404) {
        console.log(
          "[Account Deletion] User not found in Clerk, continuing cleanup",
        )
      } else {
        return NextResponse.json(
          {
            error: "Failed to delete authentication account",
            details: errorText,
          },
          { status: 500 },
        )
      }
    }

    console.log(
      `[Account Deletion] Successfully deleted user from Clerk: ${userId}`,
    )

    // Note: The Clerk webhook (user.deleted event) will handle
    // the final cleanup of the users table record

    return NextResponse.json({
      success: true,
      message: "Account successfully deleted",
    })
  } catch (error) {
    console.error("[Account Deletion] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
