/**
 * Stitch API — Project Setup Script
 *
 * Usage:
 *   node setup_project.js --list              List all projects
 *   node setup_project.js --create "Title"     Create a new project
 *   node setup_project.js --dry-run            Verify API connectivity
 *
 * Requires: Google Application Default Credentials
 *   Run scripts/setup_auth.ps1 first if not authenticated.
 */

const { execSync } = require("child_process");
const https = require("https");

const STITCH_API_BASE = "https://stitch.googleapis.com/v1";

// ─── Auth ────────────────────────────────────────────────────────────────────

function getAccessToken() {
  try {
    const token = execSync(
      "gcloud auth application-default print-access-token",
      { encoding: "utf-8" }
    ).trim();
    return token;
  } catch (err) {
    console.error(
      "ERROR: Could not get access token. Run setup_auth.ps1 first."
    );
    console.error(err.message);
    process.exit(1);
  }
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

function apiRequest(method, path, body = null) {
  const token = getAccessToken();

  return new Promise((resolve, reject) => {
    const url = new URL(`${STITCH_API_BASE}${path}`);
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
          reject(
            new Error(
              `API ${res.statusCode}: ${data.substring(0, 500)}`
            )
          );
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function listProjects() {
  console.log("Fetching projects...\n");
  const result = await apiRequest("GET", "/projects");
  const projects = result.projects || [];

  if (projects.length === 0) {
    console.log("No projects found. Create one with: --create \"Project Title\"");
    return;
  }

  console.log(`Found ${projects.length} project(s):\n`);
  console.log("  #  | Project ID             | Title");
  console.log("  ---|------------------------|---------------------------");

  projects.forEach((p, i) => {
    const id = p.name.replace("projects/", "");
    const title = p.title || "(untitled)";
    console.log(`  ${(i + 1).toString().padStart(2)} | ${id.padEnd(22)} | ${title}`);
  });
  console.log("");
}

async function createProject(title) {
  console.log(`Creating project: "${title}"...\n`);
  const result = await apiRequest("POST", "/projects", { title });
  const id = result.name.replace("projects/", "");
  console.log(`Project created successfully!`);
  console.log(`  ID:    ${id}`);
  console.log(`  Title: ${result.title}`);
  console.log(`  Name:  ${result.name}`);
  console.log("");
}

async function dryRun() {
  console.log("Running dry-run to verify API connectivity...\n");
  try {
    const token = getAccessToken();
    console.log("  ✅ Access token obtained");

    await apiRequest("GET", "/projects");
    console.log("  ✅ API connection successful");
    console.log("\nDry-run complete. Everything looks good!\n");
  } catch (err) {
    console.error(`  ❌ API connection failed: ${err.message}`);
    process.exit(1);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--dry-run")) {
    await dryRun();
  } else if (args.includes("--list")) {
    await listProjects();
  } else if (args.includes("--create")) {
    const titleIndex = args.indexOf("--create") + 1;
    const title = args[titleIndex];
    if (!title) {
      console.error('Usage: node setup_project.js --create "Project Title"');
      process.exit(1);
    }
    await createProject(title);
  } else {
    console.log("Stitch Project Setup");
    console.log("====================\n");
    console.log("Commands:");
    console.log('  --list              List all projects');
    console.log('  --create "Title"    Create a new project');
    console.log("  --dry-run           Verify API connectivity\n");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
