import { NextRequest, NextResponse } from "next/server"
// Legacy: magic promo email removed
import { prisma } from "@/lib/prisma"

// Vercel Cron Job for sending scheduled emails
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("🔄 Starting scheduled emails cron job...")

    // Check authorization for cron endpoint
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      console.error("❌ Unauthorized cron request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    // Get all pending emails that should be sent now
    const scheduledEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: "pending",
        scheduled_for: {
          lte: now,
        },
      },
      orderBy: {
        scheduled_for: "asc",
      },
    })

    if (!scheduledEmails || scheduledEmails.length === 0) {
      console.log("✅ No scheduled emails to send")
      return NextResponse.json({
        message: "No scheduled emails to send",
        processed: 0,
      })
    }

    console.log(`📧 Found ${scheduledEmails.length} emails to send`)

    let successCount = 0
    let failureCount = 0

    // Process each scheduled email
    for (const scheduledEmail of scheduledEmails) {
      try {
        const userData = scheduledEmail.user_data as {
          firstName?: string
          username?: string
        } | null

        let emailResult

        // Send the appropriate email based on type
        // No legacy email types remain; mark as failed with reason
        throw new Error(`Unsupported email type: ${scheduledEmail.email_type}`)

        if (emailResult.success) {
          // Mark as sent
          await prisma.scheduledEmail.update({
            where: { id: scheduledEmail.id },
            data: {
              status: "sent",
              sent_at: now,
            },
          })

          successCount++
          console.log(
            `✅ Sent ${scheduledEmail.email_type} to ${scheduledEmail.email}`,
          )
        } else {
          // Mark as failed
          await prisma.scheduledEmail.update({
            where: { id: scheduledEmail.id },
            data: {
              status: "failed",
              error_message: emailResult.error,
            },
          })

          failureCount++
          console.error(
            `❌ Failed to send ${scheduledEmail.email_type} to ${scheduledEmail.email}:`,
            emailResult.error,
          )
        }
      } catch (error) {
        // Mark as failed with error
        await prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: {
            status: "failed",
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          },
        })

        failureCount++
        console.error(
          `❌ Failed to process scheduled email ${scheduledEmail.id}:`,
          error,
        )
      }

      // Small delay between emails to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(
      `🎯 Scheduled emails processed: ${successCount} sent, ${failureCount} failed`,
    )

    return NextResponse.json({
      message: "Scheduled emails processed",
      processed: scheduledEmails.length,
      sent: successCount,
      failed: failureCount,
    })
  } catch (error) {
    console.error("❌ Cron job error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
