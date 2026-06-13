import { prisma } from "@/lib/prisma"
import "server-only"

export const getPurchasesWithBundles = async (userId: string | null) => {
  if (!userId) {
    return []
  }

  const purchases = await prisma.bundlePurchase.findMany({
    where: { user_id: userId },
    include: {
      bundle: {
        include: {
          bundleItems: true, // include all items (components) in the bundle
        },
      },
      bundlePlan: true, // include plan info (can be null)
    },
    orderBy: { created_at: "desc" },
  })
  return purchases
}

export const isComponentPaid = async (componentId: number) => {
  const items = await prisma.bundleItem.findFirst({
    where: { component_id: componentId },
  })
  return !!items
}
