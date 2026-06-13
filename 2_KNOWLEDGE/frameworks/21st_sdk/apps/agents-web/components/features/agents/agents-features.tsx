"use client"

const features = [
  {
    title: "Parallel Agents",
    description:
      "Work on multiple features at once. Run agents locally, in worktrees, or in the background.",
  },
  {
    title: "Full Claude Code Power",
    description:
      "All the features you love: plan mode, skills, message editing, and more.",
  },
  {
    title: "Keyboard-First UI",
    description:
      "Hotkeys for every action. Navigate, create, and manage without touching your mouse.",
  },
]

export function AgentsFeatures() {
  return (
    <section className="pt-24 pb-10 lg:pb-24 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to work with Claude Code effectively
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border/50 bg-background/50 dark:bg-white/5 p-8 shadow-lg backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
