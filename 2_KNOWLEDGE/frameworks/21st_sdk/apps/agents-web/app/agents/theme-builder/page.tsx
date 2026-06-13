import type { Metadata } from "next"
import ThemeBuilder from "@/components/features/agents/an/playground/theme-builder"

export const metadata: Metadata = {
  title: "Theme Builder | 21st Agents SDK",
  description:
    "Visually design and customize your 21st Agents SDK theme. Adjust colors, fonts, spacing, and more — then export theme.json.",
  openGraph: {
    title: "Theme Builder | 21st Agents SDK",
    description:
      "Visually design and customize your 21st Agents SDK theme. Adjust colors, fonts, spacing, and more — then export theme.json.",
    url: "https://21st.dev/agents/theme-builder",
    siteName: "21st",
    type: "website",
    images: [
      {
        url: "/opengraph-an.png",
        width: 1200,
        height: 600,
        alt: "21st Agents SDK Theme Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme Builder | 21st Agents SDK",
    description:
      "Visually design and customize your 21st Agents SDK theme. Adjust colors, fonts, spacing, and more — then export theme.json.",
    images: ["/opengraph-an.png"],
  },
}

export default function ThemeBuilderPage() {
  return <ThemeBuilder />
}
