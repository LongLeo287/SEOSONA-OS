export function CircleDoodle({
  color = "#0033FF",
  size = 10,
}: {
  color?: string
  size?: number
}) {
  const radius = (size - 2) / 2
  return (
    <svg
      fill="none"
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill={color} />
    </svg>
  )
}








