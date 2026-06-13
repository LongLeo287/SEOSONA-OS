import { prisma } from "@/lib/prisma"
import { TRPCError } from "@trpc/server"
import { FREE_USAGE_LIMIT } from "@/lib/config/subscription-plans"

export class CreditService {
  static readonly CREDIT_PRICE = 0.05 // $0.05 per credit == 400 credits = $20, 2000 credits = $100
  //   PS маржа не учитывает токены из RAG агента
  static readonly CREDIT_MARGIN = 0.5 // МАРЖА: тратим $1 — юзер платит $2. При цене кредита $0.05 реальный cost budget на кредит = $0.025

  static readonly MODEL_PRICING = {
    "claude-4-sonnet": {
      input: 0.000003, // $3 per 1M tokens
      output: 0.000015, // $15 per 1M tokens
    },
  }

  private static roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100
  }

  static getMargin(): number {
    return this.CREDIT_MARGIN
  }

  static getCreditCost(): number {
    const margin = this.getMargin()
    return this.CREDIT_PRICE * (1 - margin)
  }

  static calculateCreditsFromTokens(
    inputTokens: number,
    outputTokens: number,
    model: string = "claude-4-sonnet",
  ): number {
    const pricing =
      this.MODEL_PRICING[model as keyof typeof this.MODEL_PRICING] ||
      this.MODEL_PRICING["claude-4-sonnet"]

    const inputCost = inputTokens * pricing.input
    const outputCost = outputTokens * pricing.output
    const totalCost = inputCost + outputCost

    const creditCost = this.getCreditCost()
    const creditsNeeded = totalCost / creditCost

    return this.roundToTwoDecimals(creditsNeeded)
  }

  /**
   * Convert actual USD cost to credits
   * Used for sandbox providers that return real cost from Claude Code backend
   */
  static calculateCreditsFromUsd(totalCostUsd: number): number {
    if (totalCostUsd <= 0) return 0
    const creditCost = this.getCreditCost()
    const creditsNeeded = totalCostUsd / creditCost
    return this.roundToTwoDecimals(creditsNeeded)
  }

  static async getUserBalance(userId: string): Promise<{
    balance: number
    limit: number
    usage: number
  }> {
    let usageData = await prisma.usage.findUnique({
      where: { user_id: userId },
    })

    if (!usageData) {
      usageData = await prisma.usage.create({
        data: {
          user_id: userId,
          usage: 0,
          limit: FREE_USAGE_LIMIT,
        },
      })
    }

    const limit = usageData.limit || FREE_USAGE_LIMIT
    const usage = usageData.usage || 0
    const balance = Math.max(0, limit - usage)

    return {
      balance: this.roundToTwoDecimals(balance),
      limit: this.roundToTwoDecimals(limit),
      usage: this.roundToTwoDecimals(usage),
    }
  }

  static async checkBalance(
    userId: string,
    creditsNeeded: number,
  ): Promise<boolean> {
    const { balance } = await this.getUserBalance(userId)
    return balance >= creditsNeeded
  }

  static async consumeCredits(
    userId: string,
    creditsNeeded: number,
    model: string = "claude-4-sonnet",
  ): Promise<{
    creditsConsumed: number
    newBalance: number
  }> {
    // const hasBalance = await this.checkBalance(userId, creditsNeeded)
    // if (!hasBalance) {
    //   throw new TRPCError({
    //     code: "FORBIDDEN",
    //     message: "Insufficient credits",
    //     cause: {
    //       creditsNeeded,
    //       balance: (await this.getUserBalance(userId)).balance,
    //     },
    //   })
    // }

    const usageData = await prisma.usage.findUnique({
      where: { user_id: userId },
    })

    if (!usageData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User usage record not found",
      })
    }

    const newUsage = (usageData.usage || 0) + creditsNeeded

    await prisma.usage.update({
      where: { user_id: userId },
      data: { usage: newUsage },
    })

    return {
      creditsConsumed: this.roundToTwoDecimals(creditsNeeded),
      newBalance: this.roundToTwoDecimals(
        Math.max(0, (usageData.limit || FREE_USAGE_LIMIT) - newUsage),
      ),
    }
  }
}
