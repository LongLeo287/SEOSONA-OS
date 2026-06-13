import { CodeSandbox } from "codesandbox-sdk-v11"

export const codesandboxSdk = new CodeSandbox(process.env.CSB_API_KEY!)

export const DEFAULT_TEMPLATE = "21st-vite"

export const TEMPLATES = {
  "21st-vite": "pt_WD1p7gUMcCZeaES6kGhefS", //"kwpngs", // "g5pmhr", // "kwk42j", // "d5t2cg",
  "canvas-github": "pt_2GPrCLfrhy1ATBc4mKqQdv", // Updated with image support
}

export const DEFAULT_HIBERNATION_TIMEOUT = 60 * 3
