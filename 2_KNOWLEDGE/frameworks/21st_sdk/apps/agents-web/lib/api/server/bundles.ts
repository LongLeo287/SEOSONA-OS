import { prisma } from "@/lib/prisma"
import {
  Bundle,
  BundleItem,
  BundlePlan,
  BundlePurchase,
  Component,
  Demo,
  User,
} from "@/prisma/client"
import "server-only"

export type BundleExpanded = Bundle & {
  user: User
  bundleItems: (BundleItem & {
    component: Component & { demos: Demo[] }
  })[]
  bundlePlans: BundlePlan[]
  bundlePurchases: BundlePurchase[]
}

const expandBundles = async (
  actorUserId: string | null,
  bundleIds: number[],
) => {
  const bundles = await prisma.bundle.findMany({
    where: {
      id: { in: bundleIds },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: true,
      bundleItems: {
        include: {
          component: {
            include: {
              demos: true,
            },
          },
        },
      },
      bundlePlans: {
        orderBy: {
          type: "asc",
        },
      },
      bundlePurchases: {
        where: {
          user_id: actorUserId ?? "",
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  })

  return bundles
}

export const getBundles = async (
  actorUserId: string | null,
  authorId: string | undefined = undefined,
  searchQuery: string | undefined = undefined,
  onlyOwned: boolean = false,
  offset: number | undefined = undefined,
  limit: number | undefined = undefined,
): Promise<BundleExpanded[]> => {
  let bundleIds: number[] = []

  if (!onlyOwned) {
    let filters = []
    if (authorId) {
      filters.push({ user_id: authorId, is_public: true }) // Bundle is public
      if (actorUserId === authorId) {
        filters.push({ user_id: actorUserId }) // Bundle is owned by the actor
      }
    } else {
      filters.push({ is_public: true }) // Bundle is public
      filters.push({
        bundlePurchases: { some: { user_id: actorUserId ?? "" } }, // Bundle is purchased by the actor
      })
    }

    const result = await prisma.bundle.findMany({
      select: {
        id: true,
      },
      where: {
        OR: filters,
        name: { contains: searchQuery, mode: "insensitive" },
      },
      skip: offset,
      take: limit,
    })
    bundleIds = result.map((bundle) => bundle.id)
  } else {
    const result = await prisma.bundlePurchase.findMany({
      select: {
        bundle_id: true,
      },
      where: {
        user_id: actorUserId ?? "",
      },
      skip: offset,
      take: limit,
    })
    bundleIds = result.map((bundle) => bundle.bundle_id)
  }

  const bundles = await expandBundles(actorUserId, bundleIds)

  return bundles
}
