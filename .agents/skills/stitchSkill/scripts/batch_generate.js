/**
 * Stitch API — Batch Screen Generation Script
 *
 * Usage:
 *   node batch_generate.js --project <id> --prompts-dir <path> [options]
 *
 * Options:
 *   --project <id>         Stitch project ID (required)
 *   --prompts-dir <path>   Path to prompts directory (required)
 *   --device <type>        Device type: DESKTOP, MOBILE, TABLET (default: DESKTOP)
 *   --concurrency <n>      Max parallel generations (default: 2)
 *   --retry <n>            Max retries per screen (default: 3)
 *   --delay <ms>           Delay between generations in ms (default: 2000)
 *   --log <path>           Output log file path (default: generation_log.md)
 *   --dry-run              Validate prompts without generating
 *
 * Requires: Google Application Default Credentials
 *   Run scripts/setup_auth.ps1 first if not authenticated.
 */

const { execSync } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");

const STITCH_API_BASE = "https://stitch.googleapis.com/v1";

// ─── Config ──────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    projectId: null,
    promptsDir: null,
    device: "DESKTOP",
    concurrency: 2,
    retry: 3,
    delay: 2000,
    logPath: null,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--project":
        config.projectId = args[++i];
        break;
      case "--prompts-dir":
        config.promptsDir = args[++i];
        break;
      case "--device":
        config.device = args[++i];
        break;
      case "--concurrency":
        config.concurrency = parseInt(args[++i], 10);
        break;
      case "--retry":
        config.retry = parseInt(args[++i], 10);
        break;
      case "--delay":
        config.delay = parseInt(args[++i], 10);
        break;
      case "--log":
        config.logPath = args[++i];
        break;
      case "--dry-run":
        config.dryRun = true;
        break;
    }
  }

  if (!config.projectId || !config.promptsDir) {
    console.error("Usage: node batch_generate.js --project <id> --prompts-dir <path>");
    console.error("\nRequired: --project and --prompts-dir");
    process.exit(1);
  }

  // Default log path to prompts directory parent
  if (!config.logPath) {
    config.logPath = path.join(path.dirname(config.promptsDir), "generation_log.md");
  }

  return config;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

function getAccessToken() {
  try {
    return execSync("gcloud auth application-default print-access-token", {
      encoding: "utf-8",
    }).trim();
  } catch (err) {
    console.error("ERROR: Could not get access token. Run setup_auth.ps1 first.");
    process.exit(1);
  }
}

// ─── API ─────────────────────────────────────────────────────────────────────

function apiRequest(method, urlPath, body = null) {
  const token = getAccessToken();

  return new Promise((resolve, reject) => {
    const url = new URL(`${STITCH_API_BASE}${urlPath}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || "{}"));
        } else {
          reject(new Error(`API ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Prompt Loading ──────────────────────────────────────────────────────────

function loadPrompts(promptsDir) {
  const absoluteDir = path.resolve(promptsDir);

  if (!fs.existsSync(absoluteDir)) {
    console.error(`ERROR: Prompts directory not found: ${absoluteDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(absoluteDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error(`ERROR: No .md prompt files found in: ${absoluteDir}`);
    process.exit(1);
  }

  return files.map((file) => {
    const filePath = path.join(absoluteDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const id = file.replace(".md", "");
    return { id, file, filePath, prompt: content };
  });
}

// ─── Generation ──────────────────────────────────────────────────────────────

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateScreen(config, promptData, attempt = 1) {
  const { projectId, device } = config;

  try {
    console.log(
      `  [${promptData.id}] Generating (attempt ${attempt})...`
    );

    const result = await apiRequest(
      "POST",
      `/projects/${projectId}/screens:generateFromText`,
      {
        prompt: promptData.prompt,
        deviceType: device,
      }
    );

    const screenId = result.name
      ? result.name.split("/screens/")[1]
      : "unknown";

    console.log(`  [${promptData.id}] ✅ Success → Screen: ${screenId}`);

    return {
      ...promptData,
      screenId,
      status: "✅ Generated",
      attempts: attempt,
      error: null,
    };
  } catch (err) {
    if (attempt < config.retry) {
      console.log(
        `  [${promptData.id}] ❌ Failed (attempt ${attempt}): ${err.message}`
      );
      console.log(`  [${promptData.id}] Retrying in ${config.delay}ms...`);
      await sleep(config.delay * attempt); // exponential backoff
      return generateScreen(config, promptData, attempt + 1);
    }

    console.log(
      `  [${promptData.id}] ❌ Failed after ${attempt} attempts: ${err.message}`
    );

    return {
      ...promptData,
      screenId: null,
      status: "❌ Failed",
      attempts: attempt,
      error: err.message,
    };
  }
}

async function generateBatch(config, prompts) {
  const results = [];
  const queue = [...prompts];

  // Process in batches based on concurrency
  while (queue.length > 0) {
    const batch = queue.splice(0, config.concurrency);
    const batchResults = await Promise.all(
      batch.map((p) => generateScreen(config, p))
    );
    results.push(...batchResults);

    if (queue.length > 0) {
      console.log(`  Waiting ${config.delay}ms before next batch...`);
      await sleep(config.delay);
    }
  }

  return results;
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function writeLog(config, results) {
  const now = new Date().toISOString();
  const success = results.filter((r) => r.status.includes("✅")).length;
  const failed = results.filter((r) => r.status.includes("❌")).length;

  let log = `# Generation Log\n\n`;
  log += `## Project Info\n\n`;
  log += `- **Stitch Project ID:** ${config.projectId}\n`;
  log += `- **Device Type:** ${config.device}\n`;
  log += `- **Drawing Mode:** Script batch\n`;
  log += `- **Completed:** ${now}\n\n`;
  log += `---\n\n`;
  log += `## Generation Log\n\n`;
  log += `| # | Screen ID | File | Stitch Screen ID | Status | Attempts | Notes |\n`;
  log += `|---|---|---|---|---|---|---|\n`;

  results.forEach((r, i) => {
    const notes = r.error ? r.error.substring(0, 80) : "";
    log += `| ${i + 1} | ${r.id} | ${r.file} | ${r.screenId || "—"} | ${r.status} | ${r.attempts} | ${notes} |\n`;
  });

  log += `\n---\n\n`;
  log += `## Statistics\n\n`;
  log += `- **Total screens:** ${results.length}\n`;
  log += `- **Successfully generated:** ${success}\n`;
  log += `- **Failed:** ${failed}\n`;
  log += `- **Total attempts:** ${results.reduce((sum, r) => sum + r.attempts, 0)}\n`;

  fs.writeFileSync(config.logPath, log, "utf-8");
  console.log(`\nLog saved to: ${config.logPath}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const config = parseArgs();

  console.log("============================================");
  console.log("  Stitch Batch Screen Generator");
  console.log("============================================\n");
  console.log(`  Project:     ${config.projectId}`);
  console.log(`  Prompts:     ${path.resolve(config.promptsDir)}`);
  console.log(`  Device:      ${config.device}`);
  console.log(`  Concurrency: ${config.concurrency}`);
  console.log(`  Max Retries: ${config.retry}`);
  console.log(`  Delay:       ${config.delay}ms`);
  console.log(`  Dry Run:     ${config.dryRun}`);
  console.log("");

  // Load prompts
  const prompts = loadPrompts(config.promptsDir);
  console.log(`Found ${prompts.length} prompt file(s):\n`);
  prompts.forEach((p) => console.log(`  - ${p.file}`));
  console.log("");

  if (config.dryRun) {
    console.log("Dry-run complete. Prompts loaded and validated.\n");

    // Also verify API connectivity
    try {
      getAccessToken();
      console.log("  ✅ Access token valid");
      await apiRequest("GET", "/projects");
      console.log("  ✅ API connection successful\n");
    } catch (err) {
      console.error(`  ❌ API check failed: ${err.message}\n`);
    }
    return;
  }

  // Generate screens
  console.log("Starting generation...\n");
  const results = await generateBatch(config, prompts);

  // Write log
  writeLog(config, results);

  // Summary
  const success = results.filter((r) => r.status.includes("✅")).length;
  const failed = results.filter((r) => r.status.includes("❌")).length;

  console.log("\n============================================");
  console.log("  Generation Complete");
  console.log("============================================");
  console.log(`  ✅ Success: ${success}/${results.length}`);
  if (failed > 0) {
    console.log(`  ❌ Failed:  ${failed}/${results.length}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
