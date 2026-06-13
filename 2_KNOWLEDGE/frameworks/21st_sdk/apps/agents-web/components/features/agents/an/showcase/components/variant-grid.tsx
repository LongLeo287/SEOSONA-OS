interface VariantGridProps {
  children: React.ReactNode
  columns?: number
}

export function VariantGrid({ children, columns = 2 }: VariantGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  )
}
