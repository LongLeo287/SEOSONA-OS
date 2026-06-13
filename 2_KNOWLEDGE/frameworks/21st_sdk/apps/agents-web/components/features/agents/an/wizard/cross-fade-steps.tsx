"use client"

/**
 * Cross-fade step renderer using CSS grid stacking.
 * Each step occupies the same grid cell (1/1).
 * Active step is fully opaque; others fade out and shift down.
 */
export function CrossFadeSteps<T extends string>({
  stepsToRender,
  activeStep,
  renderStep,
}: {
  stepsToRender: T[]
  activeStep: T
  renderStep: (step: T) => React.ReactNode
}) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
      {stepsToRender.map((step) => {
        const isActive = step === activeStep
        return (
          <div
            key={step}
            style={{
              gridArea: "1 / 1",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {renderStep(step)}
          </div>
        )
      })}
    </div>
  )
}
