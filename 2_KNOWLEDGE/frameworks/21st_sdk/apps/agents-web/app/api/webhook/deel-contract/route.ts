import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { mapDeelToAttioStatus } from "@/lib/mapping"
import { assertPersonByEmail, upsertListEntryByPerson } from "@/lib/attio"
import { getContract } from "@/lib/deel"

const WEBHOOK_SECRET = process.env.DEEL_WEBHOOK_SECRET || ""

function verifySignature(raw: Buffer, signatureHex: string): boolean {
  try {
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET)
    hmac.update("POST")
    hmac.update(raw)
    const expected = hmac.digest("hex")
    const a = Buffer.from(signatureHex, "hex")
    const b = Buffer.from(expected, "hex")
    return a.length === b.length && crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const raw = Buffer.from(await request.arrayBuffer())
    const signature = request.headers.get("x-deel-signature") || ""
    if (!signature || !verifySignature(raw, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const evt = JSON.parse(raw.toString("utf8"))
    const type = evt.event_type || evt.event

    // contract.created — сохраняем связь contractId ↔ email в Attio (People.deel_contract_id)
    if (type === "contract.created") {
      const contractId: string | undefined = evt.data?.id
      const contractorEmail: string | undefined = evt.data?.contractor?.email
      const countryCode: string | undefined = evt.data?.contractor?.country
      if (contractId && contractorEmail) {
        const personId = await assertPersonByEmail({
          email: contractorEmail,
          firstName: evt.data?.contractor?.first_name,
          lastName: evt.data?.contractor?.last_name,
          countryCode: countryCode,
          deel_contract_id: contractId,
        })
        if (personId) await upsertListEntryByPerson(personId, "Contract Sent")
      }
    }

    if (type === "contract.status.updated") {
      const contractId: string | undefined = evt.data?.id
      const deelStatus: string | undefined = evt.data?.status
      if (contractId && deelStatus) {
        const attioStatus = mapDeelToAttioStatus(deelStatus)

        // Try to resolve email — from event or by fetching contract
        let email: string | undefined = evt.data?.contractor?.email
        let countryCode: string | undefined = evt.data?.contractor?.country
        let firstName: string | undefined = evt.data?.contractor?.first_name
        let lastName: string | undefined = evt.data?.contractor?.last_name

        if (!email) {
          const contract = await getContract(contractId).catch(() => null)
          email = (contract as any)?.contractor?.email
          countryCode = countryCode || (contract as any)?.contractor?.country
          firstName = firstName || (contract as any)?.contractor?.first_name
          lastName = lastName || (contract as any)?.contractor?.last_name
        }
        if (email) {
          const personId = await assertPersonByEmail({
            email,
            firstName,
            lastName,
            countryCode,
            deel_contract_id: contractId,
          })
          if (personId) await upsertListEntryByPerson(personId, attioStatus)

          // Reverse-sync is_partner for Active/Archived
          if (attioStatus === "Active" || attioStatus === "Archived") {
            const { PrismaClient } = await import("@/prisma/client")
            const prisma = new PrismaClient()

            await prisma.user.updateMany({
              where: { email: email },
              data: { is_partner: attioStatus === "Active" },
            })

            await prisma.$disconnect()
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("💥 Deel webhook failed:", error)
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 },
    )
  }
}
