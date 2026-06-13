import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playground (Old)",
}

export default function PlaygroundOldLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
