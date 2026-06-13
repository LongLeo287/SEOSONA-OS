"use client"

const steps = [
  {
    step: "1",
    title: "Sign In with Anthropic",
    description:
      "Connect your Anthropic account. Uses your Claude Pro/Max subscription.",
  },
  {
    step: "2",
    title: "Run Agents Anywhere",
    description:
      "Launch agents from the web or the macOS app. Same power, your choice.",
  },
  {
    step: "3",
    title: "Ship from the UI",
    description:
      "Open PRs and merge changes directly in our interface. No context switching.",
  },
]

export function AgentsHowItWorks() {
  return (
    <section className="py-10 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with Claude Code in three simple steps
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border/50 bg-background/50 dark:bg-white/5 p-8 shadow-lg backdrop-blur-sm"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
