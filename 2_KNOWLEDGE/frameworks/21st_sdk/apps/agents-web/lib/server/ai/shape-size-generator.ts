/**
 * Shape size configuration types
 */
export interface ShapeSize {
  width: number
  height: number
  name: string
  description: string
}

/**
 * Predefined shape size options (desktop and mobile only)
 */
export const SHAPE_SIZE_OPTIONS: Record<string, ShapeSize> = {
  desktop: {
    width: 1440,
    height: 900,
    name: "Desktop",
    description: "Desktop layouts, pages, dashboards, and web interfaces",
  },
  mobile: {
    width: 375,
    height: 812,
    name: "Mobile",
    description: "Mobile apps, phone interfaces, and responsive components",
  },
} as const

export type ShapeSizeKey = keyof typeof SHAPE_SIZE_OPTIONS

/**
 * Generate intelligent shape size determination using AI
 */
export async function generateIntelligentShapeSize(
  userMessage: string,
): Promise<ShapeSize> {
  try {
    const { generateObject } = await import("ai")
    const { fulfillModel } = await import("./index")
    const { generateShapeSizePrompt } = await import("./magic.prompt")
    const { z } = await import("zod")

    // Define the structured output schema
    const shapeSizeSchema = z.object({
      sizeKey: z.enum(["desktop", "mobile"]),
    })

    const prompt = generateShapeSizePrompt(userMessage)

    const response = await generateObject({
      ...fulfillModel("gpt-5-nano", false),
      schema: shapeSizeSchema,
      prompt,
    })

    const { sizeKey } = response.object
    const selectedSize = SHAPE_SIZE_OPTIONS[sizeKey]

    console.log(
      `Shape size determined: "${sizeKey}" (${selectedSize.width}×${selectedSize.height})`,
    )

    return selectedSize
  } catch (error) {
    console.warn(
      "Failed to generate intelligent shape size, using default:",
      error,
    )
  }

  // Fallback to desktop size (default)
  return SHAPE_SIZE_OPTIONS.desktop
}
