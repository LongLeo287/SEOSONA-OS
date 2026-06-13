import { ImageThumbInput } from "./image-thumb-input"
import { FileChip } from "./file-chip"
import type { ChatThemeConfig } from "../../theme-config"

export interface AttachedImage {
  id: string
  filename: string
  url: string
  size?: number
}

export interface AttachedFile {
  id: string
  filename: string
  size?: number
}

interface ContextItemsProps {
  images: AttachedImage[]
  files: AttachedFile[]
  previewStyle: ChatThemeConfig["attachmentPreviewStyle"]
  innerRadius?: number
  onRemoveImage?: (id: string) => void
  onRemoveFile?: (id: string) => void
}

export function ContextItems({
  images,
  files,
  previewStyle,
  innerRadius,
  onRemoveImage,
  onRemoveFile,
}: ContextItemsProps) {
  if (previewStyle === "hidden") return null
  if (images.length === 0 && files.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      {images.map((img) =>
        previewStyle === "thumbnail" ? (
          <ImageThumbInput
            key={img.id}
            id={img.id}
            filename={img.filename}
            url={img.url}
            innerRadius={innerRadius}
            onRemove={onRemoveImage ? () => onRemoveImage(img.id) : undefined}
          />
        ) : (
          <FileChip
            key={img.id}
            id={img.id}
            filename={img.filename}
            size={img.size}
            isImage
            url={img.url}
            innerRadius={innerRadius}
            onRemove={onRemoveImage ? () => onRemoveImage(img.id) : undefined}
          />
        ),
      )}
      {files.map((file) => (
        <FileChip
          key={file.id}
          id={file.id}
          filename={file.filename}
          size={file.size}
          innerRadius={innerRadius}
          onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
        />
      ))}
    </div>
  )
}
