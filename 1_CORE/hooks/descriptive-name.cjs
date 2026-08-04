#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { isHookEnabled } = require('./lib/ck-config-utils.cjs');

// Early exit if hook disabled in config
if (!isHookEnabled('descriptive-name')) {
  process.exit(0);
}

try {
  let injectedPrompt = `IMPORTANT: MUST use kebab-case file naming with a long descriptive name to ensure this file name is self-documenting, 
so that when LLM is using tools (Grep, Glob, Search) to list files, it can guess what the file does right away without reading the file.`

  // NOTE: this used to emit "permissionDecision": "allow". That is a blanket AUTO-APPROVE — for
  // every tool call the matcher covers, the confirmation prompt is skipped. It was never the point
  // of a file-naming reminder, and it silently widened permissions for whichever tools this hook
  // got registered against. Removed: a reminder must not grant permission. The hook now emits only
  // context and leaves the decision to the normal permission rules.
  console.log(JSON.stringify({
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "additionalContext": injectedPrompt
    }
  }));

  // All paths allowed
  process.exit(0);

} catch (error) {
  // Fail-open for unexpected errors
  console.error('WARN: Hook error, allowing operation -', error.message);
  process.exit(0);
}
