import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/prisma/client"
import "server-only"

export async function getUsers({ searchQuery }: { searchQuery?: string }) {
  let filters: Prisma.UserWhereInput[] = []
  if (searchQuery) {
    filters = [
      ...filters,
      {
        display_username: { contains: searchQuery, mode: "insensitive" },
      },
      { username: { contains: searchQuery, mode: "insensitive" } },
    ]
  }

  const users = await prisma.user.findMany({
    where: filters.length > 0 ? { OR: filters } : {},
    take: 100,
    orderBy: { display_username: "desc" },
  })
  return users
}

export const checkIsAdmin = async (userId: string | null) => {
  if (!userId) {
    return false
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  return user?.is_admin
}
