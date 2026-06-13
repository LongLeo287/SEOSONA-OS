/**
 * Helper function to safely checkout to a commit and create/reuse a branch
 * This prevents "branch already exists" errors when restoring to the same message multiple times
 */
export async function safeCheckoutToCommit(
  session: any,
  commit: { hash: string; message: string },
  messageId?: string,
): Promise<string> {
  // First checkout to the commit (detached HEAD)
  await session.git.checkout(commit.hash)

  // Create deterministic branch name based on messageId
  // This allows us to reuse branches when restoring to the same message
  const branchName = `restore-${messageId || commit.message}`

  try {
    // Try to checkout to existing branch
    await session.git.checkout(branchName)
    console.log(`Switched to existing branch: ${branchName}`)
  } catch (e) {
    // If branch doesn't exist, create it
    try {
      await session.git.checkout(branchName, true)
      console.log(`Created new branch: ${branchName}`)
    } catch (createError) {
      // If we still can't create the branch (shouldn't happen with unique names),
      // add timestamp as fallback
      const fallbackBranch = `${branchName}-${Date.now()}`
      await session.git.checkout(fallbackBranch, true)
      console.log(`Created fallback branch: ${fallbackBranch}`)
      return fallbackBranch
    }
  }

  return branchName
}

export async function safeCheckoutToCommitWithTimestamp(
  session: any,
  commit: { hash: string; message: string },
): Promise<string> {
  console.log("🔧 [safeCheckout] Starting restore to branch:", {
    branchName: commit.message,
    hash: commit.hash,
    timestamp: new Date().toISOString(),
  })

  // Since each commit is now on its own branch, we just need to checkout to that branch
  const branchName = commit.message
  
  try {
    // Use shell command for more reliable checkout
    await session.commands.run(`git checkout ${branchName}`)
    console.log(`✅ [safeCheckout] Successfully switched to branch: ${branchName}`)
    
    // Verify we're on the correct branch using shell command
    const currentBranchResult = await session.commands.run(`git branch --show-current`)
    const currentBranch = currentBranchResult.trim()
    
    console.log("📊 [safeCheckout] Final git status:", {
      branch: currentBranch,
      expectedBranch: branchName,
      isCorrectBranch: currentBranch === branchName,
    })
    
    if (currentBranch !== branchName) {
      console.warn("⚠️ [safeCheckout] Warning: Not on expected branch", {
        expected: branchName,
        actual: currentBranch,
      })
    }
    
    return branchName
  } catch (error) {
    console.error("❌ [safeCheckout] Failed to checkout to branch:", error)
    
    // Fallback: try force checkout
    console.log("🔄 [safeCheckout] Trying force checkout")
    try {
      await session.commands.run(`git checkout -f ${branchName}`)
      console.log("✅ [safeCheckout] Force checkout successful")
      return branchName
    } catch (fallbackError) {
      console.error("❌ [safeCheckout] Force checkout also failed:", fallbackError)
      
      // Last resort: checkout to commit hash directly
      try {
        await session.commands.run(`git checkout ${commit.hash}`)
        console.log("✅ [safeCheckout] Checked out to commit hash directly")
        return commit.hash
      } catch (lastError) {
        console.error("❌ [safeCheckout] All checkout attempts failed:", lastError)
        throw lastError
      }
    }
  }
}
