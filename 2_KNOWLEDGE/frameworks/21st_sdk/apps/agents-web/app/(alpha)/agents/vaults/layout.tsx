import type { Metadata } from "next"

export const metadata: Metadata = { title: "Vaults" }

export default function VaultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
