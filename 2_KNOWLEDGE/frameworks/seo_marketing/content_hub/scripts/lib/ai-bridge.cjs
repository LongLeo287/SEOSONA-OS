/**
 * AI Bridge - Connects Content Hub UI to Claude Code CLI
 * Uses user's Claude Code subscription (no extra API cost)
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Execute Claude Code CLI with prompt
 * @param {string} prompt - The prompt to send
 * @param {object} options - Options for execution
 * @returns {Promise<object>} - Claude response
 */
function executeClaudeCode(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      outputFormat = 'json',
      tools = 'Read,Edit,Write',
      timeout = 120000, // 2 minutes
      cwd = process.cwd()
    } = options;

    const args = [
      '-p', // Print mode (non-interactive)
      '--output-format', outputFormat,
      '--tools', tools,
      prompt
    ];

    const claude = spawn('claude', args, {
      cwd,
      env: process.env,
      timeout
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    claude.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Claude exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        // Parse JSON output
        if (outputFormat === 'json') {
          const result = JSON.parse(stdout);
          resolve(result);
        } else {
          resolve({ text: stdout });
        }
      } catch (err) {
        // If JSON parse fails, return as text
        resolve({ text: stdout, parseError: true });
      }
    });

    claude.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });
  });
}

/**
 * Enhance content with AI
 * @param {string} content - Original content
 * @param {string} instruction - Enhancement instruction
 * @param {string} filePath - Path to the file (for context)
 * @returns {Promise<string>} - Enhanced content
 */
async function enhanceContent(content, instruction, filePath) {
  const prompt = `
You are enhancing marketing content. Here's the task:

FILE: ${filePath}
INSTRUCTION: ${instruction}

ORIGINAL CONTENT:
---
${content}
---

Provide the improved content. Output ONLY the enhanced content, no explanations.
`;

  const result = await executeClaudeCode(prompt, {
    tools: 'Read', // Read-only for safety
    timeout: 60000
  });

  // Extract text from result
  if (result.result) {
    return result.result;
  }
  if (result.text) {
    return result.text;
  }
  return content; // Fallback to original
}

/**
 * Generate new content with AI
 * @param {string} type - Content type (blog, social, email, etc.)
 * @param {string} description - What to generate
 * @param {object} context - Additional context (brand, etc.)
 * @returns {Promise<string>} - Generated content
 */
async function generateContent(type, description, context = {}) {
  const brandContext = context.brand
    ? `BRAND CONTEXT: ${JSON.stringify(context.brand)}`
    : '';

  const prompt = `
Generate marketing content.

TYPE: ${type}
DESCRIPTION: ${description}
${brandContext}

Generate high-quality ${type} content based on the description.
Output ONLY the content, formatted appropriately for the type.
`;

  const result = await executeClaudeCode(prompt, {
    tools: 'Read',
    timeout: 90000
  });

  if (result.result) {
    return result.result;
  }
  if (result.text) {
    return result.text;
  }
  throw new Error('Failed to generate content');
}

/**
 * Check if Claude Code CLI is available
 * @returns {Promise<boolean>}
 */
async function isClaudeAvailable() {
  return new Promise((resolve) => {
    const claude = spawn('claude', ['--version'], { timeout: 5000 });
    claude.on('close', (code) => resolve(code === 0));
    claude.on('error', () => resolve(false));
  });
}

module.exports = {
  executeClaudeCode,
  enhanceContent,
  generateContent,
  isClaudeAvailable
};
