export const V1_TEMPLATES = {
  "vite-shadcn": {
    sandboxId: "pt_SiZtAkuSaGcxXCJ2MvDgCR", //"wfdnjr",
    extraDependencies: {
      next: "latest",
      "next-themes": "latest",
    },
  },
  "magic-agent": {
    sandboxId: "pt_X6VFJ6F3hdg9asxnwtQFh9",
    extraDependencies: {
      next: "latest",
      "next-themes": "latest",
    },
  },
  "magic-agent-canvas": {
    sandboxId: "pt_LRtWSyiMqaUd4BPDUhGSmo",
    extraDependencies: {
      next: "latest",
      "next-themes": "latest",
    },
  },
  "next-shadcn": {
    sandboxId: "jtgn28",
    extraDependencies: {},
  },
} as const satisfies Record<
  string,
  {
    sandboxId: string
    extraDependencies: Record<string, string>
  }
>

export const AGENTS_E2B_TEMPLATE = "agents-github-1770412780287"

export const ROOT_PATH = "/project/sandbox"
export const ROOT_PATH_E2B = "/home/user"

export const normalizeSandboxPath = (
  path: string,
  rootPath: string = ROOT_PATH,
) => {
  // Remove existing root if exists
  if (path.startsWith(ROOT_PATH)) {
    path = path.slice(ROOT_PATH.length)
  }
  if (path.startsWith(ROOT_PATH_E2B)) {
    path = path.slice(ROOT_PATH_E2B.length)
  }

  if (!path.startsWith(rootPath)) {
    return `${rootPath}${path.startsWith("/") ? path : `/${path}`}`
  }
  return path
}

export type SetupVariant = "canvas" | "agents"

export const REPO_ROOT_RELATIVE_PATH = "repo"
export const DISPLAY_REPO_ROOT_RELATIVE_PATH = "repo-display"

export const APP_RELATIVE_PATH = `${REPO_ROOT_RELATIVE_PATH}/src/App.tsx`
export const INDEX_CSS_RELATIVE_PATH = `${REPO_ROOT_RELATIVE_PATH}/src/index.css`

export const REPO_ROOT_PATH = normalizeSandboxPath(REPO_ROOT_RELATIVE_PATH)
export const DISPLAY_REPO_ROOT_PATH = normalizeSandboxPath(
  DISPLAY_REPO_ROOT_RELATIVE_PATH,
)
export const HTML_FOLDER = normalizeSandboxPath("repo-display/dist")
export const HTML_PATH = `${HTML_FOLDER}/index.html`
export const PLANS_PATH = normalizeSandboxPath("plan")
export const APP_PATH = normalizeSandboxPath(APP_RELATIVE_PATH)

export const LINTER_COMMAND = `cd ${REPO_ROOT_PATH} && pnpm run tscgo --noEmit`
