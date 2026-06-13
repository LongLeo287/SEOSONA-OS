import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { UsageService } from "./services/usage.service"

export const usageRouter = createTRPCRouter({
  getUserUsage: protectedProcedure.query(async ({ ctx }) => {
    return await UsageService.getUserUsage(ctx.auth.userId)
  }),

  calculateUsageDiscount: protectedProcedure.query(async ({ ctx }) => {
    return await UsageService.calculateUsageDiscount(ctx.auth.userId)
  }),
})
