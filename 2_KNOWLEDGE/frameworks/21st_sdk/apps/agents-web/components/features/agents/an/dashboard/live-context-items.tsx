"use client"

import type { AttachmentPreviewStyle } from "../types/visual"
import { LiveImageThumb } from "./live-image-thumb"
import { LiveFileChip } from "./live-file-chip"

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

interface LiveContextItemsProps {
  images: AttachedImage[]
  files: AttachedFile[]
  previewStyle: AttachmentPreviewStyle
  innerRadius?: number
  onRemoveImage?: (id: string) => void
  onRemoveFile?: (id: string) => void
}

export function LiveContextItems({
  images,
  files,
  previewStyle,
  innerRadius,
  onRemoveImage,
  onRemoveFile,
}: LiveContextItemsProps) {
  if (previewStyle === "hidden") return null
  if (images.length === 0 && files.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      {images.map((img) =>
        previewStyle === "thumbnail" ? (
          <LiveImageThumb
            key={img.id}
            id={img.id}
            filename={img.filename}
            url={img.url}
            innerRadius={innerRadius}
            onRemove={onRemoveImage ? () => onRemoveImage(img.id) : undefined}
          />
        ) : (
          <LiveFileChip
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
        <LiveFileChip
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
