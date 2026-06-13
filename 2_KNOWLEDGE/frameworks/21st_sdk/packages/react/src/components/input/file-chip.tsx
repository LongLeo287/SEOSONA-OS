import { useState } from "react"
import { X, FileText, FileCode, FileJson, ImageIcon } from "lucide-react"

interface FileChipProps {
  id: string
  filename: string
  size?: number
  isImage?: boolean
  url?: string
  innerRadius?: number
  onRemove?: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(filename: string, isImage?: boolean) {
  if (isImage) return ImageIcon

  const ext = filename.split(".").pop()?.toLowerCase()

  if (
    [
      "js", "ts", "jsx", "tsx", "py", "rb", "go", "rs",
      "java", "kt", "swift", "c", "cpp", "h", "hpp", "cs", "php",
    ].includes(ext || "")
  ) {
    return FileCode
  }

  if (["json", "yaml", "yml", "xml"].includes(ext || "")) {
    return FileJson
  }

  return FileText
}

export function FileChip({
  filename,
  size,
  isImage,
  url,
  innerRadius,
  onRemove,
}: FileChipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getFileIcon(filename, isImage)
  const radius = innerRadius ?? 6
  const iconRadius = Math.max(2, radius - 2)

  return (
    <div
      className="relative flex items-center gap-2 pl-1 pr-2 py-1 bg-muted/50 min-w-[120px] max-w-[200px]"
      style={{ borderRadius: `${radius}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isImage && url ? (
        <div
          className="w-8 self-stretch overflow-hidden shrink-0"
          style={{ borderRadius: `${iconRadius}px` }}
        >
          <img src={url} alt={filename} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-8 self-stretch bg-muted shrink-0"
          style={{ borderRadius: `${iconRadius}px` }}
        >
          <Icon className="size-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span
          className="text-sm font-medium text-foreground truncate"
          title={filename}
        >
          {filename}
        </span>
        {size !== undefined && (
          <span className="text-[10px] text-muted-foreground">
            {formatFileSize(size)}
          </span>
        )}
      </div>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={`absolute -top-1.5 -right-1.5 size-4 rounded-full bg-background border border-border
                     flex items-center justify-center transition-[opacity,transform] duration-150 ease-out active:scale-[0.97] z-10
                     text-muted-foreground hover:text-foreground
                     ${isHovered ? "opacity-100" : "opacity-0"}`}
          type="button"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}
