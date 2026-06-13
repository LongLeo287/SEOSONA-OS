import { useState } from "react"
import { X, ImageOff } from "lucide-react"

interface ImageThumbInputProps {
  id: string
  filename: string
  url: string
  innerRadius?: number
  onRemove?: () => void
}

export function ImageThumbInput({
  filename,
  url,
  innerRadius,
  onRemove,
}: ImageThumbInputProps) {
  const [hasError, setHasError] = useState(false)
  const radius = innerRadius ?? 6

  return (
    <div
      className="relative size-[40px] border border-border/50 p-0.5"
      style={{ borderRadius: `${radius}px` }}
    >
      {hasError ? (
        <div
          className="w-full h-full flex items-center justify-center bg-muted/50 border border-destructive/20"
          style={{ borderRadius: `${Math.max(2, radius - 2)}px` }}
        >
          <ImageOff className="size-4 text-destructive/50" />
        </div>
      ) : (
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover"
          style={{ borderRadius: `${Math.max(2, radius - 2)}px` }}
          onError={() => setHasError(true)}
        />
      )}

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-0 right-0 size-5 flex items-center justify-center z-10"
          type="button"
        >
          <span className="size-3 rounded-full backdrop-blur-md bg-black/40 flex items-center justify-center active:scale-[0.97] text-white/80 hover:text-white">
            <X className="size-2" strokeWidth={2.5} />
          </span>
        </button>
      )}
    </div>
  )
}
