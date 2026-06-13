import { NextRequest, NextResponse } from "next/server"
import { Sandbox } from "@e2b/code-interpreter"
import { auth } from "@clerk/nextjs/server"
import { verifyDesktopToken } from "@/lib/desktop-auth"

export const maxDuration = 60

// Binary file extensions that shouldn't have content displayed
const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "ico", "bmp", "tiff",
  "pdf", "zip", "tar", "gz", "rar", "7z",
  "woff", "woff2", "ttf", "eot", "otf",
  "mp3", "mp4", "wav", "webm", "ogg", "avi", "mov",
  "exe", "dll", "so", "dylib", "bin",
  "sqlite", "db", "lock",
])

const MAX_FILE_SIZE = 100_000 // 100KB
const MAX_UNTRACKED_FILES = 50

function isBinaryByExtension(filePath: string): boolean {
  const ext = filePath.split(".").pop()?.toLowerCase() || ""
  return BINARY_EXTENSIONS.has(ext)
}

function generateSyntheticDiff(
  filePath: string,
  content: string | null,
  isBinary: boolean,
  isLargeFile: boolean,
): string {
  const header = `diff --git a/${filePath} b/${filePath}
new file mode 100644
index 0000000..0000001
--- /dev/null
+++ b/${filePath}`

  if (isBinary) {
    return `${header}
Binary files /dev/null and b/${filePath} differ
`
  }

  if (isLargeFile || content === null) {
    return `${header}
@@ -0,0 +1 @@
+[File too large to display]
`
  }

  let lines = content.split("\n")
  // Remove trailing empty element if file ends with newline
  if (content.endsWith("\n") && lines.length > 0 && lines[lines.length - 1] === "") {
    lines = lines.slice(0, -1)
  }

  // Handle empty files - no hunk needed, just the header
  if (lines.length === 0) {
    return `${header}
`
  }

  const lineCount = lines.length
  const hunkHeader = `@@ -0,0 +1,${lineCount} @@`
  const diffLines = lines.map((line) => `+${line}`).join("\n")

  // Check if file ends without newline
  const noNewlineMarker = content.endsWith("\n") ? "" : "\n\\ No newline at end of file"

  return `${header}
${hunkHeader}
${diffLines}${noNewlineMarker}
`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  try {
    // Check Clerk auth first, then fall back to desktop token
    let userId = (await auth()).userId
    if (!userId) {
      const desktopToken = request.headers.get("x-desktop-token")
      if (desktopToken) {
        userId = await verifyDesktopToken(desktopToken)
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sandboxId } = await params

    // Connect to e2b sandbox (auto-resumes if paused)
    const sbx = await Sandbox.connect(sandboxId, {
      timeoutMs: 1_800_000, // 30 min
    })

    // NOTE: We intentionally do NOT auto-commit changes here.
    // This endpoint should be READ-ONLY to preserve git state for "Open Locally" feature.
    // The export endpoint needs to capture the exact working tree state (staged, unstaged, untracked).

    // Check if origin remote exists and is real GitHub
    let diffCommand: string
    try {
      const originResult = await sbx.commands.run(
        "cd /home/user/repo && git remote get-url origin 2>/dev/null",
      )
      const originUrl = originResult.stdout.trim()
      const hasGitHubOrigin =
        originUrl.startsWith("https://") || originUrl.startsWith("git@")

      if (hasGitHubOrigin) {
        // Use origin/HEAD (not origin/HEAD...HEAD) to include uncommitted changes
        // origin/HEAD...HEAD only shows committed changes between merge-base and HEAD
        // origin/HEAD shows ALL changes (committed + staged + unstaged) vs origin
        diffCommand =
          "cd /home/user/repo && git --no-pager diff origin/HEAD"
      } else {
        const secondCommitResult = await sbx.commands.run(
          "cd /home/user/repo && git rev-list --reverse HEAD | sed -n '2p'",
        )
        const baseCommit = secondCommitResult.stdout.trim().split("\n")[0]

        if (!baseCommit) {
          return NextResponse.json({ diff: "" })
        }

        // Use baseCommit (not baseCommit...HEAD) to include uncommitted changes
        diffCommand = `cd /home/user/repo && git --no-pager diff ${baseCommit} -- . ':!.*' ':!*lock*' ':!*.lock'`
      }
    } catch {
      const secondCommitResult = await sbx.commands.run(
        "cd /home/user/repo && git rev-list --reverse HEAD | sed -n '2p'",
      )
      const baseCommit = secondCommitResult.stdout.trim().split("\n")[0]

      if (!baseCommit) {
        return NextResponse.json({ diff: "" })
      }

      // Use baseCommit (not baseCommit...HEAD) to include uncommitted changes
      diffCommand = `cd /home/user/repo && git --no-pager diff ${baseCommit} -- . ':!.*' ':!*lock*' ':!*.lock'`
    }

    // Get the tracked files diff
    const diffResult = await sbx.commands.run(diffCommand)
    const trackedDiff = diffResult.stdout || ""

    // Get untracked files list (read-only operation)
    const untrackedResult = await sbx.commands.run(
      "cd /home/user/repo && git ls-files --others --exclude-standard",
    )
    const untrackedFiles = untrackedResult.stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .slice(0, MAX_UNTRACKED_FILES)

    // Generate synthetic diffs for untracked files in parallel
    let syntheticDiffs = ""
    if (untrackedFiles.length > 0) {
      const syntheticDiffPromises = untrackedFiles.map(async (filePath) => {
        try {
          // Check if binary by extension first
          if (isBinaryByExtension(filePath)) {
            return generateSyntheticDiff(filePath, null, true, false)
          }

          // Check file size
          const statResult = await sbx.commands.run(
            `stat -f%z "/home/user/repo/${filePath}" 2>/dev/null || stat -c%s "/home/user/repo/${filePath}" 2>/dev/null`,
          )
          const fileSize = parseInt(statResult.stdout.trim(), 10) || 0

          if (fileSize > MAX_FILE_SIZE) {
            return generateSyntheticDiff(filePath, null, false, true)
          }

          // Read file content
          const content = await sbx.files.read(`/home/user/repo/${filePath}`)

          // Check for binary content (null bytes)
          if (typeof content === "string" && content.includes("\0")) {
            return generateSyntheticDiff(filePath, null, true, false)
          }

          return generateSyntheticDiff(
            filePath,
            typeof content === "string" ? content : null,
            false,
            false,
          )
        } catch {
          // If we can't read the file, show it as binary
          return generateSyntheticDiff(filePath, null, true, false)
        }
      })

      const results = await Promise.all(syntheticDiffPromises)
      syntheticDiffs = results.join("")
    }

    // Combine tracked diff with synthetic diffs for untracked files
    const combinedDiff = trackedDiff + syntheticDiffs

    // Debug logging
    console.log("[E2B-DIFF] Tracked diff length:", trackedDiff.length)
    console.log("[E2B-DIFF] Untracked files:", untrackedFiles)
    console.log("[E2B-DIFF] Synthetic diffs length:", syntheticDiffs.length)
    if (syntheticDiffs) {
      console.log("[E2B-DIFF] Synthetic diff preview:", syntheticDiffs.slice(0, 500))
    }

    return NextResponse.json({ diff: combinedDiff })
  } catch (error) {
    console.error("[E2B-DIFF] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch diff",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
