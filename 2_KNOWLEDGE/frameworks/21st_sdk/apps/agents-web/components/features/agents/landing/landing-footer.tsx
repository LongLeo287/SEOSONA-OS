"use client"

export function LandingFooter() {
  return (
    <div className="px-8 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[13px] text-white/25">1Code by 21st</span>
      <div className="flex flex-col gap-1 sm:items-end">
        <span className="text-[13px] text-white/25">support@21st.dev</span>
        <span className="text-[11px] text-white/15">
          21st.dev is not affiliated with or endorsed by Anthropic or OpenAI.
        </span>
      </div>
    </div>
  )
}
