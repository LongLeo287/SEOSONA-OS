"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { BundleExpanded, getBundles } from "./server/bundles"

export type { BundleExpanded }

const getBundlesActionSchema = z.object({
  authorId: z.string().optional(),
  onlyOwned: z.boolean().optional(),
  searchQuery: z.string().optional(),
  offset: z.number().int().nonnegative().optional(),
  limit: z.number().int().nonnegative().optional(),
})

export const getBundlesAction = async (
  input: z.infer<typeof getBundlesActionSchema>,
): Promise<BundleExpanded[]> => {
  const { authorId, searchQuery, onlyOwned, offset, limit } =
    getBundlesActionSchema.parse(input)

  const { userId } = await auth()
  let bundles = await getBundles(
    userId,
    authorId,
    searchQuery,
    onlyOwned,
    offset,
    limit,
  )
  const purchasedBundles = await prisma.bundlePurchase.findMany({
    where: {
      user_id: userId ?? "",
      status: "paid",
    },
  })

  // Obfuscate sources for not purchased bundles
  bundles.forEach((bundle) => {
    const isPurchased = purchasedBundles.some(
      (purchase) => purchase.bundle_id === bundle.id,
    )
    if (!isPurchased) {
      bundle.bundleItems.forEach((item) => {
        item.component.code = ""
        item.component.registry_url = ""
        item.component.index_css_url = ""
        item.component.demos.forEach((demo) => {
          demo.demo_code = ""
        })
      })
    }
  })

  return bundles
}
