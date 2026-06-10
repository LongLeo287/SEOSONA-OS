# SEOSONA Global System Prompts Integration

This document outlines the standard procedures for linking various IDEs and AI tools to the SEOSONA Central Agent System (`1_CORE/SOUL.md`).

## 1. Project-Level Integration (Recommended)
Use the `seosona init` CLI command.
- Run `seosona init` at the root of your project.
- This creates `.cursorrules`, `.clauderules`, `.windsurfrules`, `.antigravityrules`, etc.
- The AI will automatically read `~/.seosona/1_CORE/SOUL.md` before proceeding.

## 2. Cursor IDE (Global Configuration)
If you do not want to use `seosona init` per project, you can set it globally in Cursor.
1. Open Cursor Settings.
2. Go to **General** -> **Rules for AI**.
3. Paste the following exact instruction:
   > `You are bound by the SEOSONA Master System. Read your Prime Directive at ~/.seosona/1_CORE/SOUL.md before executing any prompt.`

## 3. Claude Code (CLI)
For Anthropic's Claude Code CLI tool:
1. You can pass the file directly in your terminal alias.
2. Example for your PowerShell `$PROFILE`:
   ```powershell
   function claude-ag {
       claude --system-prompt-file "$HOME/.seosona/1_CORE/SOUL.md" $args
   }
   ```

## 4. Antigravity IDE
1. In the Antigravity IDE global settings or custom system prompt, specify:
   > `Before doing any work, read and strictly adhere to the guidelines specified in ~/.seosona/1_CORE/SOUL.md.`

> **Note:** `~/.seosona` is a filesystem junction/symlink created by `seosona setup`. It always points to wherever the actual SEOSONA OS directory lives on your machine. All path references above use this universal anchor — never hardcode the physical path.
