import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"
import { StripeService } from "./services/stripe.service"

const planGroupSchema = z.enum(["core", "onecode"])
const planGroupInputSchema = z
  .object({ planGroup: planGroupSchema.optional() })
  .optional()

export const stripeRouter = createTRPCRouter({
  getUserBalance: protectedProcedure
    .input(planGroupInputSchema)
    .query(async ({ ctx, input }) => {
      return await StripeService.getUserBalance(
        ctx.auth.userId,
        input?.planGroup,
      )
    }),
  getNextPaymentDate: protectedProcedure
    .input(planGroupInputSchema)
    .query(async ({ ctx, input }) => {
      return await StripeService.getNextPaymentDate(
        ctx.auth.userId,
        input?.planGroup,
      )
    }),
  createCustomerPortalSession: protectedProcedure
    .input(planGroupInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await StripeService.createCustomerPortalSession(
        ctx.auth.userId,
        input?.planGroup,
      )
    }),
})
