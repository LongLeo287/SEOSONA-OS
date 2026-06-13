import { GoogleAnalytics } from "@next/third-parties/google"
import { GeistMono } from "geist/font/mono"
import { GeistPixelSquare, GeistPixelLine } from "geist/font/pixel"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"
import Script from "next/script"
import { headers } from "next/headers"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"
import { AppProviders } from "./providers"
import { FeaturebaseProvider } from "@/components/features/support/featurebase-provider"
import { is1CodeDomain } from "@/lib/utils/domains"

import {
  BASE_KEYWORDS,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_DESCRIPTION,
} from "@/lib/constants"
import "./globals.css"

const isDev = process.env.NODE_ENV === "development"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: `${SITE_NAME}: ${SITE_SLOGAN}`,
    template: "%s | 21st",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: isDev ? "/testflight-logo.svg" : "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${SITE_NAME}: ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@21st_dev",
    title: `${SITE_NAME}: ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  keywords: BASE_KEYWORDS,
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  const is1CodeHost = is1CodeDomain(host)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*  <Script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          strategy="beforeInteractive"
        /> */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T76WQSTW');`}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          GeistPixelSquare.variable,
          GeistPixelLine.variable,
          "font-sans [scrollbar-gutter:stable] antialiased",
        )}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T76WQSTW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="h-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme={false}
            disableTransitionOnChange
          >
            <FeaturebaseProvider>
              <TooltipProvider delayDuration={500}>
                <AppProviders is1CodeDomain={is1CodeHost}>
                  {children}
                </AppProviders>
              </TooltipProvider>
              <Toaster />
            </FeaturebaseProvider>
          </ThemeProvider>
        </div>
      </body>
      <GoogleAnalytics gaId="G-X7C2K3V7GX" />
    </html>
  )
}
