import { MetadataRoute } from "next"
import { SITE_NAME, SITE_SLOGAN } from "@/lib/constants"
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - ${SITE_SLOGAN}`,
    short_name: `${SITE_NAME}`,
    description: "Infrastructure and UI building blocks for the agentic internet.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#09090B",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
