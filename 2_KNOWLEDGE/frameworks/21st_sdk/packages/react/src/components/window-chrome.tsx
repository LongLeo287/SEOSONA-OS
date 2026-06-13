export function WindowChrome() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
      </div>
      <div className="flex-1 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
        <span className="text-[11px] font-mono text-foreground/30">Agent</span>
      </div>
    </div>
  )
}
