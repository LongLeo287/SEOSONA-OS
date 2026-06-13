"use client"

import { motion } from "motion/react"

const stackLogos = [
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 180" fill="none" className="w-5 h-5 shrink-0">
        <mask
          id="an-sp-nextjs-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
          style={{ maskType: "alpha" as const }}
        >
          <circle cx="90" cy="90" r="90" fill="white" />
        </mask>
        <g mask="url(#an-sp-nextjs-mask)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1V70.444L139.999 164.727C143.232 162.431 146.37 159.98 149.508 157.52Z"
            fill="url(#an-sp-nextjs-g1)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#an-sp-nextjs-g2)" />
        </g>
        <defs>
          <linearGradient id="an-sp-nextjs-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#09090b" />
            <stop offset="1" stopColor="#09090b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="an-sp-nextjs-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="#09090b" />
            <stop offset="1" stopColor="#09090b" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "React",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <circle cx="12" cy="12" r="2.05" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    svg: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0">
        <path
          d="M23.827,8.243A4.424,4.424,0,0,1,26.05,9.524a5.853,5.853,0,0,1,.852,1.143c.011.045-1.534,1.083-2.471,1.662-.034.023-.169-.124-.322-.35a2.014,2.014,0,0,0-1.67-1c-1.077-.074-1.771.49-1.766,1.433a1.3,1.3,0,0,0,.153.666c.237.49.677.784,2.059,1.383,2.544,1.095,3.636,1.817,4.31,2.843a5.158,5.158,0,0,1,.416,4.333,4.764,4.764,0,0,1-3.932,2.815,10.9,10.9,0,0,1-2.708-.028,6.531,6.531,0,0,1-3.616-1.884,6.278,6.278,0,0,1-.926-1.371,2.655,2.655,0,0,1,.327-.208c.158-.09.756-.434,1.32-.761L19.1,19.6l.214.312a4.771,4.771,0,0,0,1.35,1.292,3.3,3.3,0,0,0,3.458-.175,1.545,1.545,0,0,0,.2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8,8.8,0,0,1-3.349-2.055,4.687,4.687,0,0,1-.976-1.777,7.116,7.116,0,0,1-.062-2.268,4.332,4.332,0,0,1,3.644-3.374A9,9,0,0,1,23.827,8.243ZM15.484,9.726l.011,1.454h-4.63V24.328H7.6V11.183H2.97V9.755A13.986,13.986,0,0,1,3.01,8.289c.017-.023,2.832-.034,6.245-.028l6.211.017Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Python",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.898S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.868s-.11-3.403 3.35-3.403h5.77s3.24.052 3.24-3.13V3.13S18.28 0 11.913 0zm-3.21 1.818a1.046 1.046 0 1 1 0 2.092 1.046 1.046 0 0 1 0-2.092zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.123S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.868s.11 3.403-3.35 3.403h-5.77s-3.24-.052-3.24 3.13v5.402S5.72 24 12.086 24zm3.21-1.818a1.046 1.046 0 1 1 0-2.092 1.046 1.046 0 0 1 0 2.092z" />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.681zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.071.071 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    svg: (
      <svg viewBox="0 0 256 289" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M128 288.464c-3.975 0-7.685-1.056-11.13-2.904l-35.247-20.936c-5.28-2.904-2.64-3.96-1.056-4.488 7.024-2.376 8.448-2.904 15.84-7.128.792-.528 1.848-.264 2.64.264l27.104 16.104c1.056.528 2.376.528 3.168 0l105.6-61.09c1.056-.528 1.584-1.584 1.584-2.904V92.558c0-1.32-.528-2.376-1.584-2.904L128.528 28.828c-1.056-.528-2.376-.528-3.168 0L19.76 89.654c-1.056.528-1.584 1.848-1.584 2.904v122.06c0 1.056.528 2.376 1.584 2.904l28.952 16.896c15.576 7.92 25.432-1.32 25.432-10.56V103.382c0-1.584 1.32-3.168 2.904-3.168h12.452c1.584 0 2.904 1.32 2.904 3.168v120.476c0 20.672-11.22 32.56-30.8 32.56-6.072 0-10.824 0-24.112-6.6L9.2 232.518A22.916 22.916 0 0 1 0 213.634V91.574A22.916 22.916 0 0 1 9.2 72.69L114.8 11.6c5.544-3.168 13.2-3.168 18.744 0L238.8 72.69c5.544 3.168 9.2 9.24 9.2 18.876v122.068c0 7.656-3.656 14.784-9.2 18.876L133.544 293.62c-1.848.528-3.696 1.056-5.544 1.056v-6.212z" />
      </svg>
    ),
  },
]

const proofStats = [
  {
    value: "1M+",
    label: "Developers on 21st.dev",
    sub: "We build for builders",
  },
  {
    value: "14,272",
    label: "github-stars",
    sub: "Open-source tools trusted by the community",
  },
  {
    value: "YC W26",
    label: "Y Combinator",
    sub: "Backed and in the current batch",
  },
]

export function AnSocialProof() {
  return (
    <motion.section
      className="px-8 py-14 sm:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Overline */}
      <motion.p
        className="text-xs font-medium uppercase tracking-widest text-white/25 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        From the team that already ships to developers
      </motion.p>

      {/* Stat cards - seamless bordered grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-white/[0.06] mb-14">
        {proofStats.map((stat, index) => (
          <motion.div
            key={stat.value}
            className="bg-[#09090b] px-6 py-6 flex flex-col gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
          >
            <p className="font-pixel text-[clamp(1.4rem,3vw,1.875rem)] tracking-wide text-white leading-none">
              {stat.value}
            </p>
            {stat.label === "github-stars" ? (
              <p className="text-[13px] font-medium text-white/60 leading-snug">
                GitHub stars across{" "}
                <a href="https://github.com/serafimcloud/21st" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-white/80 transition-colors">21st</a>,{" "}
                <a href="https://github.com/21st-dev/1code" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-white/80 transition-colors">1code</a>,{" "}
                <a href="https://github.com/21st-dev/magic-mcp" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-white/80 transition-colors">Magic MCP</a>
              </p>
            ) : (
              <p className="text-[13px] font-medium text-white/60 leading-snug">
                {stat.label}
              </p>
            )}
            <p className="text-[12px] text-white/25 leading-snug">
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stack compatibility */}
      <div className="flex flex-col gap-5">
        <p className="text-xs font-medium uppercase tracking-widest text-white/20">
          Works with your stack
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {stackLogos.map((item, index) => (
            <motion.div
              key={item.name}
              className="flex items-center gap-2" style={{ color: "#9D9D9E" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: 0.12 + index * 0.04 }}
            >
              {item.svg}
              <span className="text-[13px] font-medium">{item.name}</span>
            </motion.div>
          ))}
          <motion.span
            className="text-[12px] text-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            + any language or framework
          </motion.span>
        </div>
      </div>
    </motion.section>
  )
}
