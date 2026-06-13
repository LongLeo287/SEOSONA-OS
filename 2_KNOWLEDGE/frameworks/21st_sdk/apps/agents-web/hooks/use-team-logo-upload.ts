"use client"

import { api } from "@/trpc/client"
import { useState } from "react"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface LogoValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates a logo file for size and type
 */
export function validateLogoFile(file: File): LogoValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" }
  }

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please select an image file" }
  }

  return { valid: true }
}

/**
 * Reads a file and returns a data URL for preview
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const useTeamLogoUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Mutation для загрузки логотипа
  const { mutateAsync: uploadLogoToR2 } = api.teams.uploadTeamLogo.useMutation()

  const uploadLogo = async ({
    teamId,
    file,
  }: {
    teamId: string
    file: File
  }) => {
    try {
      console.log("🚀 Team Logo Upload Starting:", {
        teamId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      setIsUploading(true)
      setError(null)

      // Конвертируем File в base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // Убираем data:image/...;base64, префикс
          const base64Data = result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/,
            "",
          )
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      console.log("📝 File converted to base64, length:", base64.length)

      // Загружаем через серверную функцию
      const logoUrl = await uploadLogoToR2({
        teamId,
        fileName: file.name,
        contentType: file.type,
        base64Data: base64,
      })

      console.log("✅ Logo upload successful, final URL:", logoUrl)

      return logoUrl
    } catch (err) {
      console.error("❌ Team Logo Upload Error:", err)
      setError(err instanceof Error ? err : new Error("Upload failed"))
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadLogo,
    isUploading,
    error,
  }
}
