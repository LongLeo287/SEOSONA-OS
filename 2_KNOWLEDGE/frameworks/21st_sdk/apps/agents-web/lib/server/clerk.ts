"use server"

import type { JwtPayload } from "@clerk/types"
import { verifyToken } from "@clerk/nextjs/server"

export const verifyJwtToken = async (
  jwt: string,
): Promise<JwtPayload> => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set")
  }

  return verifyToken(jwt, {
    secretKey: process.env.CLERK_SECRET_KEY,
  })
}
