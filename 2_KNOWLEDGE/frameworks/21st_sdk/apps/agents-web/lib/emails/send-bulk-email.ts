import { Resend } from "resend"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

interface SendBulkEmailParams {
  emails: string[]
  subject: string
  message: string
}

export interface EmailResult {
  email: string
  success: boolean
  error?: string
}

// Resend batch limit is 100 emails per batch
const BATCH_SIZE = 100

export async function sendBulkEmail({
  emails,
  subject,
  message,
}: SendBulkEmailParams): Promise<{
  success: boolean
  results: EmailResult[]
  error?: string
}> {
  if (!isServer) return { success: true, results: [] }

  try {
    if (!resend) {
      console.error("Resend not initialized")
      return { success: false, results: [], error: "Resend not initialized" }
    }

    const allResults: EmailResult[] = []

    // Split emails into batches of 100
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)

      try {
        const batchEmails = batch.map((email) => ({
          from: "Serafim from 21st.dev <serafim@hey.21st.dev>",
          to: email,
          replyTo: "support@21st.dev",
          subject,
          text: message,
        }))

        const response = await resend.batch.send(batchEmails)

        // Resend batch.send returns { data: CreateBatchSuccessResponse } on success
        // Individual email failures within a batch are not reported separately
        if (response.data) {
          // Mark all emails in successful batch as successful
          batch.forEach((email) => {
            allResults.push({ email, success: true })
          })
          console.log(
            `✅ Sent batch of ${batch.length} emails (${i + 1}-${i + batch.length})`,
          )
        } else if (response.error) {
          // If batch failed, mark all as failed
          const errorMessage = response.error?.message || "Batch send failed"
          batch.forEach((email) => {
            allResults.push({
              email,
              success: false,
              error: errorMessage,
            })
          })
        } else {
          // Fallback: mark all as failed
          batch.forEach((email) => {
            allResults.push({
              email,
              success: false,
              error: "Batch send failed",
            })
          })
        }
      } catch (batchError) {
        console.error(`❌ Failed to send batch:`, batchError)
        // Mark all emails in failed batch as failed
        batch.forEach((email) => {
          allResults.push({
            email,
            success: false,
            error:
              batchError instanceof Error
                ? batchError.message
                : "Unknown error",
          })
        })
      }

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    const successCount = allResults.filter((r) => r.success).length
    const failureCount = allResults.filter((r) => !r.success).length

    console.log(
      `📊 Bulk email complete: ${successCount} succeeded, ${failureCount} failed`,
    )

    return {
      success: true,
      results: allResults,
    }
  } catch (error) {
    console.error(`❌ Failed to send bulk emails:`, error)
    return {
      success: false,
      results: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
