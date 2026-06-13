import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod"
import { startOfWeek, endOfWeek, eachWeekOfInterval, format } from "date-fns"

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        product: z.enum(["magic", "21st"]),
        pmfScore: z.number().min(0).max(2).nullable(),
        npsScore: z.number().min(0).max(10).nullable(),
        comment: z.string().nullable(),
        role: z
          .enum([
            "designer",
            "frontend_developer",
            "backend_developer",
            "product_manager",
            "entrepreneur",
          ])
          .nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Используем userId из контекста
      const userId = ctx.userId || null

      // Если роль указана и пользователь авторизован, обновляем роль в профиле
      if (input.role && userId) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { role: input.role },
        })
      }

      return ctx.prisma.productFeedback.create({
        data: {
          userId,
          product: input.product,
          pmfScore: input.pmfScore,
          npsScore: input.npsScore,
          comment: input.comment,
        },
      })
    }),

  getStats: publicProcedure
    .input(
      z.object({
        product: z.enum(["magic", "21st"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.product && { product: input.product }),
        ...(input.startDate &&
          input.endDate && {
            createdAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
      }

      const [total, pmfStats, npsStats] = await Promise.all([
        ctx.prisma.productFeedback.count({ where }),

        ctx.prisma.productFeedback.groupBy({
          by: ["pmfScore"],
          where: { ...where, pmfScore: { not: null } },
          _count: true,
        }),

        ctx.prisma.productFeedback.aggregate({
          where: { ...where, npsScore: { not: null } },
          _avg: { npsScore: true },
          _count: { npsScore: true },
        }),
      ])

      const pmfDistribution = pmfStats.reduce(
        (acc, stat) => {
          acc[stat.pmfScore!] = stat._count
          return acc
        },
        {} as Record<number, number>,
      )

      const veryDisappointedPercent = pmfDistribution[2]
        ? (pmfDistribution[2] /
            Object.values(pmfDistribution).reduce((a, b) => a + b, 0)) *
          100
        : 0

      return {
        total,
        pmf: {
          distribution: pmfDistribution,
          veryDisappointedPercent,
        },
        nps: {
          average: npsStats._avg.npsScore || 0,
          count: npsStats._count.npsScore || 0,
        },
      }
    }),

  getWeeklyStats: publicProcedure
    .input(
      z.object({
        product: z.enum(["magic", "21st"]).optional(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const weeks = eachWeekOfInterval({
        start: startOfWeek(input.startDate),
        end: endOfWeek(input.endDate),
      })

      const weeklyData = await Promise.all(
        weeks.map(async (weekStart) => {
          const weekEnd = endOfWeek(weekStart)

          const where = {
            ...(input.product && { product: input.product }),
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          }

          const [pmfStats, npsStats] = await Promise.all([
            ctx.prisma.productFeedback.groupBy({
              by: ["pmfScore"],
              where: { ...where, pmfScore: { not: null } },
              _count: true,
            }),

            ctx.prisma.productFeedback.aggregate({
              where: { ...where, npsScore: { not: null } },
              _avg: { npsScore: true },
              _count: { npsScore: true },
            }),
          ])

          const pmfDistribution = pmfStats.reduce(
            (acc, stat) => {
              acc[stat.pmfScore!] = stat._count
              return acc
            },
            {} as Record<number, number>,
          )

          const totalPmfResponses = Object.values(pmfDistribution).reduce(
            (a, b) => a + b,
            0,
          )
          const veryDisappointedPercent = pmfDistribution[2]
            ? (pmfDistribution[2] / totalPmfResponses) * 100
            : 0

          return {
            week: format(weekStart, "yyyy-MM-dd"),
            veryDisappointedPercent,
            averageNps: npsStats._avg.npsScore || 0,
            totalResponses: totalPmfResponses + (npsStats._count.npsScore || 0),
          }
        }),
      )

      return {
        pmfTrend: weeklyData,
        npsTrend: weeklyData,
      }
    }),

  getComments: publicProcedure
    .input(
      z.object({
        product: z.enum(["magic", "21st"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        importantUsersOnly: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        comment: { not: null },
        ...(input.product && { product: input.product }),
        ...(input.startDate &&
          input.endDate && {
            createdAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
        ...(input.importantUsersOnly && { pmfScore: 2 }),
      }

      const [total, comments] = await Promise.all([
        ctx.prisma.productFeedback.count({ where }),
        ctx.prisma.productFeedback.findMany({
          where,
          select: {
            id: true,
            product: true,
            pmfScore: true,
            npsScore: true,
            comment: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
      ])

      return {
        comments,
        total,
        pages: Math.ceil(total / input.limit),
        page: input.page,
      }
    }),

  // AI Summarization for Important Users (Superhuman Framework)
  getImportantUsersSummary: publicProcedure
    .input(
      z.object({
        product: z.enum(["magic", "21st"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        comment: { not: null },
        pmfScore: 2, // Only "very disappointed" users (important users)
        ...(input.product && { product: input.product }),
        ...(input.startDate &&
          input.endDate && {
            createdAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          }),
      }

      const importantUsersComments = await ctx.prisma.productFeedback.findMany({
        where,
        select: {
          id: true,
          product: true,
          comment: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      // Group comments by product for better analysis
      const commentsByProduct = importantUsersComments.reduce(
        (acc, comment) => {
          if (!acc[comment.product]) {
            acc[comment.product] = []
          }
          acc[comment.product].push(comment.comment!)
          return acc
        },
        {} as Record<string, string[]>,
      )

      // Product-specific categorization
      const getProductCategories = (product: string) => {
        if (product === "magic") {
          return {
            generation_quality: [] as string[],
            components_variety: [] as string[],
            code_accuracy: [] as string[],
            ui_customization: [] as string[],
            performance: [] as string[],
            integrations: [] as string[],
            other: [] as string[],
          }
        } else {
          // 21st.dev
          return {
            component_discovery: [] as string[],
            component_quality: [] as string[],
            search_functionality: [] as string[],
            documentation: [] as string[],
            performance: [] as string[],
            user_experience: [] as string[],
            other: [] as string[],
          }
        }
      }

      type MagicCategories = {
        generation_quality: string[]
        components_variety: string[]
        code_accuracy: string[]
        ui_customization: string[]
        performance: string[]
        integrations: string[]
        other: string[]
      }

      type DevCategories = {
        component_discovery: string[]
        component_quality: string[]
        search_functionality: string[]
        documentation: string[]
        performance: string[]
        user_experience: string[]
        other: string[]
      }

      const categorizeComments = (
        comments: string[],
        product: string,
      ): MagicCategories | DevCategories => {
        const categories = getProductCategories(product)

        comments.forEach((comment) => {
          const lowerComment = comment.toLowerCase()

          if (product === "magic") {
            const magicCategories = categories as MagicCategories
            // Magic-specific categorization
            if (
              lowerComment.includes("generation") ||
              lowerComment.includes("ai") ||
              lowerComment.includes("generate") ||
              lowerComment.includes("quality")
            ) {
              magicCategories.generation_quality.push(comment)
            } else if (
              lowerComment.includes("component") ||
              lowerComment.includes("variety") ||
              lowerComment.includes("selection") ||
              lowerComment.includes("options")
            ) {
              magicCategories.components_variety.push(comment)
            } else if (
              lowerComment.includes("code") ||
              lowerComment.includes("accuracy") ||
              lowerComment.includes("correct") ||
              lowerComment.includes("wrong")
            ) {
              magicCategories.code_accuracy.push(comment)
            } else if (
              lowerComment.includes("customize") ||
              lowerComment.includes("styling") ||
              lowerComment.includes("design") ||
              lowerComment.includes("ui")
            ) {
              magicCategories.ui_customization.push(comment)
            } else if (
              lowerComment.includes("slow") ||
              lowerComment.includes("fast") ||
              lowerComment.includes("speed") ||
              lowerComment.includes("performance")
            ) {
              magicCategories.performance.push(comment)
            } else if (
              lowerComment.includes("integration") ||
              lowerComment.includes("export") ||
              lowerComment.includes("import") ||
              lowerComment.includes("framework")
            ) {
              magicCategories.integrations.push(comment)
            } else {
              magicCategories.other.push(comment)
            }
          } else {
            const devCategories = categories as DevCategories
            // 21st.dev-specific categorization
            if (
              lowerComment.includes("search") ||
              lowerComment.includes("find") ||
              lowerComment.includes("discover") ||
              lowerComment.includes("filter")
            ) {
              devCategories.search_functionality.push(comment)
            } else if (
              lowerComment.includes("component") ||
              lowerComment.includes("quality") ||
              lowerComment.includes("examples") ||
              lowerComment.includes("demo")
            ) {
              devCategories.component_quality.push(comment)
            } else if (
              lowerComment.includes("discovery") ||
              lowerComment.includes("browse") ||
              lowerComment.includes("categories") ||
              lowerComment.includes("navigation")
            ) {
              devCategories.component_discovery.push(comment)
            } else if (
              lowerComment.includes("documentation") ||
              lowerComment.includes("docs") ||
              lowerComment.includes("instructions") ||
              lowerComment.includes("guide")
            ) {
              devCategories.documentation.push(comment)
            } else if (
              lowerComment.includes("slow") ||
              lowerComment.includes("fast") ||
              lowerComment.includes("speed") ||
              lowerComment.includes("performance")
            ) {
              devCategories.performance.push(comment)
            } else if (
              lowerComment.includes("ux") ||
              lowerComment.includes("interface") ||
              lowerComment.includes("usability") ||
              lowerComment.includes("experience")
            ) {
              devCategories.user_experience.push(comment)
            } else {
              devCategories.other.push(comment)
            }
          }
        })

        return categories
      }

      const generateActionItems = (
        categories: MagicCategories | DevCategories,
        product: string,
      ) => {
        const actionItems = []

        if (product === "magic") {
          const magicCategories = categories as MagicCategories
          // Magic-specific action items
          if (magicCategories.generation_quality.length > 0) {
            actionItems.push({
              priority: "high",
              category: "AI Generation",
              action: "Improve AI component generation quality and accuracy",
              count: magicCategories.generation_quality.length,
            })
          }

          if (magicCategories.components_variety.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Component Library",
              action: "Expand component variety and selection options",
              count: magicCategories.components_variety.length,
            })
          }

          if (magicCategories.code_accuracy.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Code Quality",
              action: "Improve generated code accuracy and correctness",
              count: magicCategories.code_accuracy.length,
            })
          }

          if (magicCategories.ui_customization.length > 0) {
            actionItems.push({
              priority: "medium",
              category: "Customization",
              action: "Enhance UI customization and styling options",
              count: magicCategories.ui_customization.length,
            })
          }

          if (magicCategories.integrations.length > 0) {
            actionItems.push({
              priority: "medium",
              category: "Integrations",
              action: "Improve framework integrations and export options",
              count: magicCategories.integrations.length,
            })
          }

          if (magicCategories.performance.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Performance",
              action: "Optimize application performance and loading times",
              count: magicCategories.performance.length,
            })
          }
        } else {
          const devCategories = categories as DevCategories
          // 21st.dev-specific action items
          if (devCategories.search_functionality.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Search & Discovery",
              action: "Enhance search and filtering functionality",
              count: devCategories.search_functionality.length,
            })
          }

          if (devCategories.component_quality.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Component Quality",
              action: "Improve component examples and quality",
              count: devCategories.component_quality.length,
            })
          }

          if (devCategories.component_discovery.length > 0) {
            actionItems.push({
              priority: "medium",
              category: "Navigation",
              action: "Improve component discovery and browsing experience",
              count: devCategories.component_discovery.length,
            })
          }

          if (devCategories.documentation.length > 0) {
            actionItems.push({
              priority: "medium",
              category: "Documentation",
              action: "Enhance component documentation and guides",
              count: devCategories.documentation.length,
            })
          }

          if (devCategories.user_experience.length > 0) {
            actionItems.push({
              priority: "medium",
              category: "User Experience",
              action: "Improve overall user interface and experience",
              count: devCategories.user_experience.length,
            })
          }

          if (devCategories.performance.length > 0) {
            actionItems.push({
              priority: "high",
              category: "Performance",
              action: "Optimize application performance and loading times",
              count: devCategories.performance.length,
            })
          }
        }

        return actionItems
      }

      // Process data by product or all products
      const results: any = {}

      if (input.product) {
        // Single product analysis
        const comments = commentsByProduct[input.product] || []
        const categories = categorizeComments(comments, input.product)
        const actionItems = generateActionItems(categories, input.product)

        results[input.product] = {
          totalImportantUsers: importantUsersComments.filter(
            (c) => c.product === input.product,
          ).length,
          categories,
          actionItems,
          recentComments: importantUsersComments
            .filter((c) => c.product === input.product)
            .slice(0, 5),
        }
      } else {
        // Multi-product analysis
        ;["magic", "21st"].forEach((product) => {
          const comments = commentsByProduct[product] || []
          if (comments.length > 0) {
            const categories = categorizeComments(comments, product)
            const actionItems = generateActionItems(categories, product)

            results[product] = {
              totalImportantUsers: importantUsersComments.filter(
                (c) => c.product === product,
              ).length,
              categories,
              actionItems,
              recentComments: importantUsersComments
                .filter((c) => c.product === product)
                .slice(0, 5),
            }
          }
        })
      }

      return {
        totalImportantUsers: importantUsersComments.length,
        productData: results,
        byProduct: input.product ? results[input.product] : null,
      }
    }),
})
