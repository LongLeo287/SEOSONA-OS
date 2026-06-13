import { prisma } from "@/lib/prisma"
import "server-only"
import { getPurchasesWithBundles, isComponentPaid } from "./bundle_purchases"

export const hasUserComponentAccess = async (
  userId: string | null,
  componentId: number,
) => {
  const isPaid = await isComponentPaid(componentId)
  if (!isPaid) {
    return true
  }

  if (!userId) {
    return false
  }

  const bundles = await prisma.bundle.findMany({
    where: {
      bundleItems: {
        some: { component_id: componentId },
      },
    },
  })

  const isAuthor = bundles.some((bundle) => bundle.user_id === userId)
  if (isAuthor) {
    return true
  }

  const purchases = await getPurchasesWithBundles(userId)
  return purchases.some(
    (purchase) =>
      purchase.status === "paid" &&
      purchase.bundle.bundleItems.some(
        (item) => item.component_id === componentId,
      ),
  )
}

export const getComponentBundles = async (componentId: number) => {
  const bundles = await prisma.bundle.findMany({
    where: {
      bundleItems: { some: { component_id: componentId } },
    },
    include: {
      bundlePlans: true,
      user: true,
    },
  })

  return bundles
}

export const transferOwnership = async (
  componentId: number,
  userId: string,
) => {
  const demos = await prisma.demo.findMany({
    where: {
      component_id: componentId,
    },
  })

  const promises = []

  promises.push(
    prisma.component.update({
      where: { id: componentId },
      data: { user_id: userId },
    }),
  )

  for (const demo of demos) {
    promises.push(
      prisma.demo.update({
        where: { id: demo.id },
        data: { user_id: userId },
      }),
    )
  }

  await Promise.all(promises).catch((err) => {
    console.error(err)
    throw new Error("Failed to transfer ownership")
  })
}
