"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { DashedBox } from "./dashed-divider"

function ApiCodeSnippet() {
  const kw = "text-purple-300/70"
  const str = "text-green-300/70"
  const t = "text-white/25"
  const prop = "text-blue-300/70"
  const cmt = "text-white/20"

  return (
    <pre className="py-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
      <code>
        <span className={kw}>curl</span>
        <span className={t}>{" -X "}</span>
        <span className={str}>POST</span>
        <span className={t}>{" \\"}</span>
        {"\n"}
        {"  "}
        <span className={str}>https://1code.dev/api/v1/tasks</span>
        <span className={t}>{" \\"}</span>
        {"\n"}
        {"  "}
        <span className={t}>{'-H "'}</span>
        <span className={prop}>Authorization</span>
        <span className={t}>{": Bearer "}</span>
        <span className={str}>YOUR_API_KEY</span>
        <span className={t}>{'" \\'}</span>
        {"\n"}
        {"  "}
        <span className={t}>{"-d '{"}</span>
        {"\n"}
        {"    "}
        <span className={prop}>{'"repo"'}</span>
        <span className={t}>{": "}</span>
        <span className={str}>{'"org/repo"'}</span>
        <span className={t}>{","}</span>
        {"\n"}
        {"    "}
        <span className={prop}>{'"prompt"'}</span>
        <span className={t}>{": "}</span>
        <span className={str}>{'"Fix the auth bug"'}</span>
        {"\n"}
        {"  "}
        <span className={t}>{"}'          "}</span>
        <span className={cmt}>{"# → Returns a PR"}</span>
      </code>
    </pre>
  )
}

export function LandingApi() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* Left — text */}
        <div className="flex-1 min-w-0">
          <motion.p
            className="flex items-center gap-2 text-xs font-medium text-white/25 uppercase tracking-widest mb-8"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <rect x="0" y="0" width="10" height="2" />
              <rect x="0" y="4" width="10" height="2" />
              <rect x="0" y="8" width="10" height="2" />
            </svg>
            API
          </motion.p>

          <motion.h2
            className="font-pixel text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] tracking-wide text-white max-w-[18ch]"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.04 }}
          >
            Run agents programmatically.
          </motion.h2>

          <motion.p
            className="mt-4 text-[17px] text-white/40 max-w-[36ch] leading-relaxed"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            One API call to start a coding agent on any repo. Remote sandboxes,
            async execution, PR delivery.
          </motion.p>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <Link
              href="/1code/api"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white active:scale-[0.99] transition-all duration-150"
            >
              Learn more about the API
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Right — code snippet */}
        <motion.div
          className="mt-12 lg:mt-0 shrink-0 lg:mr-8"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <DashedBox className="px-5">
            <ApiCodeSnippet />
          </DashedBox>
        </motion.div>
      </div>
    </section>
  )
}
