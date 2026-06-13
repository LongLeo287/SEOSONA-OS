import { CodeSandbox } from "codesandbox-sdk-v1"
import * as CONSTANTS from "./codesandbox-constants"

export const codesandboxSdk = new CodeSandbox(process.env.CSB_API_KEY!)

export const DEFAULT_TEMPLATE = "vite-shadcn" as const

export const ROOT_PATH = "/project/sandbox"

export const DEFAULT_HIBERNATION_TIMEOUT_SECONDS = 120 // 60 seconds

export const EXTENDED_HIBERNATION_TIMEOUT_SECONDS = 60 * 10 // 60 seconds

export const TEMPLATES = CONSTANTS.V1_TEMPLATES
