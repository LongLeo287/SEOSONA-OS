"use client"

import { api } from "@/trpc/client"

export const useIsAdmin = () => {
  const { data: isCurrentUserAdmin = false } =
    api.users.isCurrentUserAdmin.useQuery()

  return isCurrentUserAdmin
}
