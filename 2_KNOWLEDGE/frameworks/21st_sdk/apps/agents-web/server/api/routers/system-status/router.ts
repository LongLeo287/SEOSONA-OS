import { z } from "zod"
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const systemStatusRouter = createTRPCRouter({
  // Публичный метод для получения активных статусов
  getActiveStatus: publicProcedure.query(async ({ ctx }) => {
    const activeStatus = await ctx.prisma.systemStatus.findFirst({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    })

    return activeStatus
  }),

  // Метод для получения всех статусов (только для админов)
  getAllStatuses: adminProcedure.query(async ({ ctx }) => {
    const statuses = await ctx.prisma.systemStatus.findMany({
      orderBy: { created_at: "desc" },
    })

    return statuses
  }),

  // Создание нового статуса (только для админов)
  createStatus: adminProcedure
    .input(
      z.object({
        message: z.string().min(1, "Message is required"),
        severity: z.enum(["info", "warning", "error"]).default("info"),
        is_active: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Если создаем активный статус, деактивируем все остальные
      if (input.is_active) {
        await ctx.prisma.systemStatus.updateMany({
          where: { is_active: true },
          data: { is_active: false, updated_by: ctx.auth.userId },
        })
      }

      const newStatus = await ctx.prisma.systemStatus.create({
        data: {
          message: input.message,
          severity: input.severity,
          is_active: input.is_active,
          created_by: ctx.auth.userId,
          updated_by: ctx.auth.userId,
        },
      })

      return newStatus
    }),

  // Обновление статуса (только для админов)
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        message: z.string().min(1, "Message is required").optional(),
        severity: z.enum(["info", "warning", "error"]).optional(),
        is_active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Если активируем этот статус, деактивируем все остальные
      if (input.is_active === true) {
        await ctx.prisma.systemStatus.updateMany({
          where: {
            is_active: true,
            id: { not: input.id },
          },
          data: { is_active: false, updated_by: ctx.auth.userId },
        })
      }

      const updatedStatus = await ctx.prisma.systemStatus.update({
        where: { id: input.id },
        data: {
          ...(input.message && { message: input.message }),
          ...(input.severity && { severity: input.severity }),
          ...(input.is_active !== undefined && { is_active: input.is_active }),
          updated_by: ctx.auth.userId,
        },
      })

      return updatedStatus
    }),

  // Удаление статуса (только для админов)
  deleteStatus: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.systemStatus.delete({
          where: { id: input.id },
        })

        return { success: true }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete status",
          cause: error,
        })
      }
    }),

  // Деактивация всех статусов (убирает баннер)
  deactivateAll: adminProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.prisma.systemStatus.updateMany({
        where: { is_active: true },
        data: { is_active: false, updated_by: ctx.auth.userId },
      })

      return { success: true }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to deactivate statuses",
        cause: error,
      })
    }
  }),
})
