import { prisma } from "@/lib/prisma"
import { hashApiKey } from "@repo/api-key-security"
import { Decimal } from "@prisma/client/runtime/library"

interface RecordMcpComponentUsageParams {
  userId: string
  apiKey: string
  searchQuery: string
  componentIds: number[]
  authorIds: string[]
}

interface McpUsageResult {
  success: boolean
  generation_request_id?: number
  subscription_plan?: string
  generation_cost?: Decimal
  component_count?: number
  author_share_per_component?: Decimal
  ai_cost_share?: Decimal
  platform_share?: Decimal
  total_author_share?: Decimal
  error?: string
}

export async function recordMcpComponentUsage({
  userId,
  apiKey,
  searchQuery,
  componentIds,
  authorIds,
}: RecordMcpComponentUsageParams): Promise<McpUsageResult> {
  try {
    let generationCost = new Decimal(0.2)
    let subscriptionPlan = "free"

    const userPlan = await prisma.usersToPlan.findFirst({
      where: {
        user_id: userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    if (userPlan?.plan) {
      subscriptionPlan = userPlan.plan.type || "free"

      if (userPlan.plan.type === "free") {
        generationCost = new Decimal(0)
      } else if (
        ["standard", "pro"].includes(userPlan.plan.type || "") &&
        userPlan.plan.add_usage &&
        userPlan.plan.add_usage > 0
      ) {
        generationCost = new Decimal(userPlan.plan.price || 0).div(
          userPlan.plan.add_usage,
        )
      }
    } else {
      subscriptionPlan = "free"
      generationCost = new Decimal(0)
    }

    const generationRequest = await prisma.mcpGenerationRequest.create({
      data: {
        user_id: userId,
        api_key: hashApiKey(apiKey),
        search_query: searchQuery,
        subscription_plan: subscriptionPlan,
        generation_cost: generationCost,
      },
    })

    let aiCostShare = new Decimal(0)
    let remainingShare = new Decimal(0)
    let platformShare = new Decimal(0)
    let totalAuthorShare = new Decimal(0)
    let authorSharePerComponent = new Decimal(0)

    if (!generationCost.isZero()) {
      aiCostShare = generationCost.mul(0.5)
      remainingShare = generationCost.mul(0.5)
      platformShare = remainingShare.mul(0.5)
      totalAuthorShare = remainingShare.mul(0.5)
    }

    const componentCount = componentIds.length

    if (componentCount === 0) {
      return {
        success: true,
        generation_request_id: generationRequest.id,
        subscription_plan: subscriptionPlan,
        generation_cost: generationCost,
        component_count: 0,
        author_share_per_component: new Decimal(0),
        ai_cost_share: aiCostShare,
        platform_share: platformShare,
        total_author_share: totalAuthorShare,
      }
    }

    if (!totalAuthorShare.isZero()) {
      authorSharePerComponent = totalAuthorShare.div(componentCount)
    }

    const componentUsageData = componentIds.map((componentId, index) => ({
      generation_request_id: generationRequest.id,
      component_id: componentId,
      author_id: authorIds[index]!,
      author_share: authorSharePerComponent,
    }))

    await prisma.mcpComponentUsage.createMany({
      data: componentUsageData,
    })

    return {
      success: true,
      generation_request_id: generationRequest.id,
      subscription_plan: subscriptionPlan,
      generation_cost: generationCost,
      component_count: componentCount,
      author_share_per_component: authorSharePerComponent,
      ai_cost_share: aiCostShare,
      platform_share: platformShare,
      total_author_share: totalAuthorShare,
    }
  } catch (error) {
    console.error("Error recording MCP component usage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function recordMcpComponentUsageAsync(
  params: RecordMcpComponentUsageParams,
): Promise<void> {
  recordMcpComponentUsage(params)
    .then((result) => {
      if (result.success) {
        console.log("MCP usage recorded successfully:", {
          requestId: result.generation_request_id,
          plan: result.subscription_plan,
          cost: result.generation_cost?.toString(),
          componentCount: result.component_count,
        })
      } else {
        console.error("Failed to record MCP usage:", result.error)
      }
    })
    .catch((error) => {
      console.error("Exception in async MCP usage recording:", error)
    })
}

interface RecordMcpUsageByDemoIdsParams {
  demoIds: number[]
  userId: string
  application: string
  applicationGenerationId: string
}

export async function recordMcpUsageByDemoIds({
  demoIds,
  userId,
  application,
  applicationGenerationId,
}: RecordMcpUsageByDemoIdsParams): Promise<void> {
  try {
    const demos = await prisma.demo.findMany({
      where: {
        id: { in: demoIds },
      },
      include: {
        component: {
          include: {
            user: true,
          },
        },
      },
    })

    if (demos.length === 0) {
      console.log("No demos found for the provided demo IDs")
      return
    }

    const componentIds: number[] = []
    const authorIds: string[] = []

    demos.forEach((demo) => {
      if (demo.component) {
        componentIds.push(demo.component.id)
        authorIds.push(demo.component.user_id)
      }
    })

    if (componentIds.length === 0) {
      console.log("No valid components found for the provided demo IDs")
      return
    }

    await recordMcpComponentUsageAsync({
      userId,
      apiKey: application,
      searchQuery: applicationGenerationId,
      componentIds,
      authorIds,
    })
  } catch (error) {
    console.error("Error recording MCP usage by demo IDs:", error)
  }
}
