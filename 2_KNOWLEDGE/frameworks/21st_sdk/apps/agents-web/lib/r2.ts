"use server"
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true })

if (
  !process.env.R2_ACCESS_KEY_ID ||
  !process.env.R2_SECRET_ACCESS_KEY ||
  !process.env.NEXT_PUBLIC_R2_ENDPOINT
) {
  throw new Error(
    "R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and NEXT_PUBLIC_R2_ENDPOINT must be set",
  )
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

export const uploadToR2 = async ({
  file,
  fileKey,
  bucketName,
  contentType = "text/plain",
}: {
  file: {
    name: string
    type: string
    textContent?: string
    encodedContent?: string
    binaryData?: Uint8Array
  }
  fileKey: string
  bucketName: string
  contentType?: string
}): Promise<string> => {
  try {
    console.log(`uploadToR2 called for file: ${file.name}`, {
      hasTextContent: !!file.textContent,
      hasEncodedContent: !!file.encodedContent,
      hasBinaryData: !!file.binaryData,
      textContentLength: file.textContent?.length || 0,
      encodedContentLength: file.encodedContent?.length || 0,
      binaryDataLength: file.binaryData?.length || 0,
    })

    if (!file.textContent && !file.encodedContent && !file.binaryData) {
      throw new Error(
        "textContent, encodedContent, or binaryData must be provided",
      )
    }

    // Additional validation for empty content
    if (file.textContent !== undefined && file.textContent.length === 0) {
      throw new Error("textContent cannot be empty")
    }

    if (file.encodedContent !== undefined && file.encodedContent.length === 0) {
      throw new Error("encodedContent cannot be empty")
    }

    if (file.binaryData !== undefined && file.binaryData.length === 0) {
      throw new Error("binaryData cannot be empty")
    }

    const content = file.binaryData
      ? file.binaryData
      : file.textContent
        ? file.textContent
        : Buffer.from(file.encodedContent!, "base64")

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: content,
      ContentType: contentType,
    })

    await r2Client.send(command)

    return bucketName === "assets"
      ? `https://assets.21st.dev/${fileKey}`
      : `${process.env.NEXT_PUBLIC_CDN_URL}/${fileKey}`
  } catch (error) {
    console.error("Error uploading to R2:", error)
    throw error
  }
}

export const generatePresignedUrl = async ({
  fileKey,
  bucketName,
  contentType = "text/plain",
  expiresIn = 3600, // URL expires in 1 hour by default
}: {
  fileKey: string
  bucketName: string
  contentType?: string
  expiresIn?: number
}): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    return presignedUrl
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw error
  }
}

export const deleteFromR2 = async ({
  fileKey,
  bucketName,
}: {
  fileKey: string
  bucketName: string
}): Promise<void> => {
  try {
    console.log(`Deleting file from R2: ${fileKey}`)

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    })

    await r2Client.send(command)
    console.log(`Successfully deleted: ${fileKey}`)
  } catch (error) {
    console.error("Error deleting from R2:", error)
    throw error
  }
}

export const deleteDirectoryFromR2 = async ({
  directoryPrefix,
  bucketName,
}: {
  directoryPrefix: string
  bucketName: string
}): Promise<void> => {
  try {
    console.log(`Deleting directory from R2: ${directoryPrefix}`)

    let continuationToken: string | undefined

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: directoryPrefix,
        ContinuationToken: continuationToken,
      })

      const listResponse = await r2Client.send(listCommand)

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        const deletePromises = listResponse.Contents.map(async (object) => {
          if (object.Key) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: bucketName,
              Key: object.Key,
            })
            await r2Client.send(deleteCommand)
            console.log(`Deleted: ${object.Key}`)
          }
        })

        await Promise.all(deletePromises)
      }

      continuationToken = listResponse.NextContinuationToken
    } while (continuationToken)

    console.log(`Successfully deleted directory: ${directoryPrefix}`)
  } catch (error) {
    console.error("Error deleting directory from R2:", error)
    throw error
  }
}

export const getFromR2 = async ({
  fileKey,
  bucketName,
}: {
  fileKey: string
  bucketName: string
}): Promise<{ content: Uint8Array; contentType?: string } | null> => {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      }),
    )

    if (!response.Body) {
      return null
    }

    const content = await response.Body.transformToByteArray()
    const contentType =
      typeof response.ContentType === "string"
        ? response.ContentType
        : undefined

    return { content, contentType }
  } catch (error) {
    console.error("Error fetching from R2:", error)
    return null
  }
}

export const existsInR2 = async ({
  fileKey,
  bucketName,
}: {
  fileKey: string
  bucketName: string
}): Promise<string | undefined> => {
  const expectedUrl = `https://${bucketName}.21st.dev/${fileKey}`
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      }),
    )
    return expectedUrl
  } catch (error: unknown) {
    const err = error as {
      $metadata?: { httpStatusCode?: number }
      name?: string
    }
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") {
      return undefined
    }
    console.error("Error checking existence in R2:", error)
    return undefined
  }
}
