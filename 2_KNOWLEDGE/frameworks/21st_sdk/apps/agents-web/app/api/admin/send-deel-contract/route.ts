import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@/prisma/client"
import { z } from "zod"

const contractInputSchema = z.object({
  contractorEmail: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  countryCode: z.string().optional(),
  currency: z.string().min(1),
  rateAmount: z.number().positive(),
  rateUnit: z.enum(["hour", "task"]),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Check admin access
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { is_admin: true },
    })

    if (!user?.is_admin) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      )
    }

    await prisma.$disconnect()

    // 3. Validate input
    const body = await req.json()
    const validatedInput = contractInputSchema.parse(body)

    // 4-5. Temporarily disabled: sending Deel contracts and Attio updates are paused
    // const contract = await createPaygContract(validatedInput)
    // const personId = await assertPersonByEmail({
    //   email: validatedInput.contractorEmail,
    //   firstName: validatedInput.firstName,
    //   lastName: validatedInput.lastName,
    //   countryCode: validatedInput.countryCode,
    //   deel_contract_id: contract.id,
    // })
    // if (personId) await upsertListEntryByPerson(personId, "Contract Sent")

    return NextResponse.json({
      contractId: null,
      disabled: true,
      message: "Contract sending is temporarily disabled",
      inputValidated: !!validatedInput,
    })
  } catch (error) {
    console.error("send-deel-contract failed:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 },
    )
  }
}
