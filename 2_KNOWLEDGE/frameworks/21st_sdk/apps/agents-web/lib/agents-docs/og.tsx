import { ImageResponse } from "next/og"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

const SECTION_LABELS: Record<string, string> = {
  build: "Build",
  customization: "Customization",
  reference: "Reference",
  templates: "Templates",
}

const geistSemiBold = fetch(`${BASE_URL}/fonts/Geist-SemiBold.ttf`).then(
  (res) => res.arrayBuffer(),
)
const geistRegular = fetch(`${BASE_URL}/fonts/Geist-Regular.ttf`).then(
  (res) => res.arrayBuffer(),
)
const geistMedium = fetch(`${BASE_URL}/fonts/Geist-Medium.ttf`).then(
  (res) => res.arrayBuffer(),
)

export async function generateDocsOgImage({
  title,
  description = "",
  section = "",
}: {
  title: string
  description?: string
  section?: string
}) {
  const [semiBoldFont, regularFont, mediumFont] = await Promise.all([
    geistSemiBold,
    geistRegular,
    geistMedium,
  ])

  const sectionLabel = SECTION_LABELS[section] || ""

  const dashedLineSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg width="1200" height="1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0.5" x2="1200" y2="0.5" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 6" stroke-linecap="round"/></svg>`,
  )}`

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "white",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* Left border */}
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        {/* Right border */}
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "0 49px",
          }}
        >
          {/* Nav row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 400 400" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M358.333 0C381.345 0 400 18.6548 400 41.6667V295.833C400 298.135 398.134 300 395.833 300H270.833C268.532 300 266.667 301.865 266.667 304.167V395.833C266.667 398.134 264.801 400 262.5 400H41.6667C18.6548 400 0 381.345 0 358.333V304.72C0 301.793 1.54269 299.081 4.05273 297.575L153.76 207.747C157.159 205.708 156.02 200.679 152.376 200.065L151.628 200H4.16667C1.86548 200 6.71103e-08 198.135 0 195.833V104.167C1.07376e-06 101.865 1.86548 100 4.16667 100H162.5C164.801 100 166.667 98.1345 166.667 95.8333V4.16667C166.667 1.86548 168.532 1.00666e-07 170.833 0H358.333ZM170.833 100C168.532 100 166.667 101.865 166.667 104.167V295.833C166.667 298.135 168.532 300 170.833 300H262.5C264.801 300 266.667 298.135 266.667 295.833V104.167C266.667 101.865 264.801 100 262.5 100H170.833Z"
                  fill="white"
                />
              </svg>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                21st
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {sectionLabel ? (
                <>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>Docs</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
                  <span>{sectionLabel}</span>
                </>
              ) : (
                <span>Docs</span>
              )}
            </div>
          </div>

          {/* Dashed divider (top) */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              backgroundImage: `url("${dashedLineSvg}")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "100% 1px",
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              padding: "0 32px",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="rgba(255,255,255,0.25)"
              >
                <rect x="0" y="0" width="10" height="2" />
                <rect x="0" y="4" width="10" height="2" />
                <rect x="0" y="8" width="10" height="2" />
              </svg>
              Documentation
            </div>

            <div
              style={{
                fontSize: 52,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                maxWidth: "80%",
              }}
            >
              {title}
            </div>

            {description && (
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.4,
                  maxWidth: "70%",
                }}
              >
                {description.length > 130
                  ? description.slice(0, 130) + "..."
                  : description}
              </div>
            )}
          </div>

          {/* Dashed divider (bottom) */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              backgroundImage: `url("${dashedLineSvg}")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "100% 1px",
            }}
          />

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 400,
                color: "rgba(255,255,255,0.25)",
              }}
            >
              21st.dev/agents/docs
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "5px 14px",
              }}
            >
              21st Agents SDK
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: regularFont, weight: 400 as const, style: "normal" as const },
        { name: "Geist", data: mediumFont, weight: 500 as const, style: "normal" as const },
        { name: "Geist", data: semiBoldFont, weight: 600 as const, style: "normal" as const },
      ],
    },
  )
}
