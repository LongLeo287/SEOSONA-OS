declare module 'modern-screenshot' {
    export function domToDataUrl(
        node: HTMLElement,
        options?: {
            width?: number
            height?: number
            scale?: number
            backgroundColor?: string
            style?: Record<string, string>
            type?: string
            quality?: number
        }
    ): Promise<string>

    export function domToPng(
        node: HTMLElement,
        options?: {
            width?: number
            height?: number
            scale?: number
            backgroundColor?: string
            style?: Record<string, string>
        }
    ): Promise<string>

    export function domToJpeg(
        node: HTMLElement,
        options?: {
            width?: number
            height?: number
            scale?: number
            backgroundColor?: string
            style?: Record<string, string>
        }
    ): Promise<string>

    export function domToWebp(
        node: HTMLElement,
        options?: {
            width?: number
            height?: number
            scale?: number
            backgroundColor?: string
            style?: Record<string, string>
        }
    ): Promise<string>

    export function domToSvg(
        node: HTMLElement,
        options?: {
            width?: number
            height?: number
            scale?: number
            backgroundColor?: string
            style?: Record<string, string>
        }
    ): Promise<string>
}