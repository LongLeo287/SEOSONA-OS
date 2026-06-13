import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { createHmac } from "crypto"

// Initialize Resend
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface UnsubscribeToken {
  userId: string
  email: string
  action: "unsubscribe"
  exp?: number // Expiration timestamp (optional for backwards compatibility)
}

// Escape HTML to prevent XSS
function escapeHtml(s: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return s.replace(/[&<>"']/g, (c) => htmlEscapes[c] || c)
}

// Verify HMAC signature
function verifyToken(token: string): { valid: boolean; data: UnsubscribeToken | null; error?: string } {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    
    // Check if it's a signed token (contains '.')
    if (decoded.includes(".")) {
      const lastDotIndex = decoded.lastIndexOf(".")
      const payload = decoded.substring(0, lastDotIndex)
      const signature = decoded.substring(lastDotIndex + 1)
      
      const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET
      if (!unsubscribeSecret) {
        console.warn("UNSUBSCRIBE_SECRET not set, using fallback")
      }
      
      const expectedSignature = createHmac("sha256", unsubscribeSecret || "fallback-secret")
        .update(payload)
        .digest("hex")
      
      if (signature !== expectedSignature) {
        return { valid: false, data: null, error: "Invalid signature" }
      }
      
      const data: UnsubscribeToken = JSON.parse(payload)
      
      // Check expiration if present
      if (data.exp && Date.now() > data.exp) {
        return { valid: false, data: null, error: "Token expired" }
      }
      
      return { valid: true, data }
    }
    
    // Legacy unsigned token (for backwards compatibility with existing emails)
    const data: UnsubscribeToken = JSON.parse(decoded)
    return { valid: true, data }
  } catch {
    return { valid: false, data: null, error: "Invalid token format" }
  }
}

/**
 * Token-based unsubscribe endpoint
 * Allows users to unsubscribe from emails without logging in
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return new NextResponse(renderErrorPage("Missing unsubscribe token"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    })
  }

  try {
    // Verify and decode token
    const { valid, data, error } = verifyToken(token)
    
    if (!valid || !data) {
      return new NextResponse(renderErrorPage(error || "Invalid unsubscribe token"), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      })
    }

    if (!data.userId || !data.email || data.action !== "unsubscribe") {
      return new NextResponse(renderErrorPage("Invalid unsubscribe token"), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      })
    }

    // Get email preferences
    const prefs = await prisma.emailPreferences.findUnique({
      where: { user_id: data.userId },
    })

    if (!prefs) {
      // Create preferences with unsubscribed state
      await prisma.emailPreferences.create({
        data: {
          user_id: data.userId,
          newsletter_subscribed: false,
          include_trending: true,
          include_personalized: true,
          include_from_followed: true,
        },
      })
    } else {
      // Update to unsubscribed
      await prisma.emailPreferences.update({
        where: { user_id: data.userId },
        data: { newsletter_subscribed: false },
      })

      // Also update Resend audience if we have contact ID
      if (resend && prefs.resend_contact_id && process.env.NEWSLETTER_AUDIENCE) {
        try {
          await resend.contacts.update({
            id: prefs.resend_contact_id,
            audienceId: process.env.NEWSLETTER_AUDIENCE,
            unsubscribed: true,
          })
        } catch (error) {
          console.error("Failed to update Resend contact:", error)
          // Don't fail the unsubscribe, just log the error
        }
      }
    }

    console.log(`✅ Unsubscribed user ${data.userId} (${data.email}) from newsletter`)

    // Return success page (escape email for XSS protection)
    return new NextResponse(renderSuccessPage(escapeHtml(data.email)), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return new NextResponse(renderErrorPage("Failed to process unsubscribe request"), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    })
  }
}

function renderSuccessPage(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - 21st.dev</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0033ff 0%, #0022aa 100%);
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon svg { width: 32px; height: 32px; color: white; }
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #111;
      margin-bottom: 12px;
    }
    p {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .email {
      font-weight: 500;
      color: #111;
    }
    a {
      display: inline-block;
      background: #0033ff;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    a:hover { background: #0022aa; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1>You've been unsubscribed</h1>
    <p>
      <span class="email">${email}</span> will no longer receive our weekly digest emails.
      You can always re-subscribe from your account settings.
    </p>
    <a href="https://21st.dev">Go to 21st.dev</a>
  </div>
</body>
</html>
`
}

function renderErrorPage(message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - 21st.dev</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0033ff 0%, #0022aa 100%);
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon svg { width: 32px; height: 32px; color: white; }
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #111;
      margin-bottom: 12px;
    }
    p {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: #0033ff;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    a:hover { background: #0022aa; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h1>Something went wrong</h1>
    <p>${escapeHtml(message)}</p>
    <a href="https://21st.dev">Go to 21st.dev</a>
  </div>
</body>
</html>
`
}

