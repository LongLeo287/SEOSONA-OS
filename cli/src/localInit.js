const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { getSoulContent, getAppDataPath, colors } = require('./utils');

function runInit() {
    const cwd = process.cwd();

    // ============================================================
    // SELF-INJECTION GUARD
    // Prevent running `seosona init` inside the SEOSONA OS source
    // repo itself. This would create rule files in cli/, repos/, etc.
    // ============================================================
    const isSeosonaSourceRepo = fs.existsSync(path.join(cwd, '1_CORE', 'SOUL.md'));
    if (isSeosonaSourceRepo) {
        console.log("");
        console.log(colors.yellow("[SEOSONA] WARNING: Self-injection detected and blocked."));
        console.log(colors.yellow("          You are running `seosona init` inside the SEOSONA OS"));
        console.log(colors.yellow("          source repository. This is not allowed."));
        console.log("");
        console.log("          Run `seosona init` inside your OWN project folder instead:");
        console.log("          > cd /path/to/your-project");
        console.log("          > seosona init");
        console.log("");
        return;
    }

    console.log("");
    console.log(colors.cyan("[SEOSONA] Binding project to SEOSONA OS..."));
    console.log(colors.cyan(`  Target : ${cwd}`));

    const connector = path.join(os.homedir(), ".seosona", "1_CORE", "scripts", "project_connector.js");
    if (fs.existsSync(connector)) {
        execFileSync(process.execPath, [connector, "init", cwd], { stdio: "inherit" });
        return;
    }

    const soulContent = getSoulContent();
    const globalPrompt = `You are the SEOSONA Master System. Your core directives are below:\n\n${soulContent}`;
    const appData = getAppDataPath();
    const home = os.homedir();

    const filesToCreate = [];

    // 1. Base AI IDEs
    if (fs.existsSync(path.join(appData, "Cursor"))) filesToCreate.push(".cursorrules");
    if (fs.existsSync(path.join(appData, "Windsurf"))) filesToCreate.push(".windsurfrules");
    if (fs.existsSync(path.join(home, ".codex"))) filesToCreate.push(".codexrules");
    if (fs.existsSync(path.join(home, ".securecoder"))) filesToCreate.push(".securecoderrules");

    // 2. Extensions
    if (fs.existsSync(path.join(appData, "Code")) || fs.existsSync(path.join(appData, "VSCodium"))) {
        filesToCreate.push(".clinerules");
        filesToCreate.push(".roomodes");
    }

    // 3. CLIs
    if (fs.existsSync(path.join(home, ".aider.conf.yml"))) filesToCreate.push(".aider.conf.yml");
    
    // 4. OpenInterpreter
    if (fs.existsSync(path.join(appData, "Open Interpreter"))) filesToCreate.push(".openinterpreter");

    // 5. Antigravity IDE (always inject)
    filesToCreate.push(".antigravityrules");

    // 6. Project-specific Subfolders
    if (fs.existsSync(".github")) filesToCreate.push(path.join(".github", "copilot-instructions.md"));
    if (fs.existsSync(".cody")) filesToCreate.push(path.join(".cody", "prompt"));
    if (fs.existsSync(".bolt")) filesToCreate.push(path.join(".bolt", "prompt"));
    if (fs.existsSync(".lovable")) filesToCreate.push(path.join(".lovable", "prompt"));

    filesToCreate.forEach(file => {
        const fullPath = path.join(cwd, file);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (file === '.aider.conf.yml') {
            // Aider requires 'system-prompt' (hyphenated) key in YAML
            const indented = globalPrompt.replace(/\r\n/g, '\n').replace(/\n/g, '\n  ');
            fs.writeFileSync(fullPath, `system-prompt: |\n  ${indented}`, 'utf8');
        } else if (file === '.roomodes') {
            // Roo Code expects a JSON object with customModes array
            const rooConfig = {
                customModes: [{
                    slug: 'seosona-master',
                    name: 'SEOSONA Master',
                    roleDefinition: globalPrompt,
                    groups: ['read', 'edit', 'browser', 'command', 'mcp']
                }]
            };
            fs.writeFileSync(fullPath, JSON.stringify(rooConfig, null, 2), 'utf8');
        } else {
    const globalPrompt = `You are the SEOSONA Master System. Your core directives are below:\n\n${soulContent}`;
    const appData = getAppDataPath();
    const home = os.homedir();

    const filesToCreate = [];

    // 1. Base AI IDEs
    if (fs.existsSync(path.join(appData, "Cursor"))) filesToCreate.push(".cursorrules");
    if (fs.existsSync(path.join(appData, "Windsurf"))) filesToCreate.push(".windsurfrules");
    if (fs.existsSync(path.join(home, ".codex"))) filesToCreate.push(".codexrules");
    if (fs.existsSync(path.join(home, ".securecoder"))) filesToCreate.push(".securecoderrules");

    // 2. Extensions
    if (fs.existsSync(path.join(appData, "Code")) || fs.existsSync(path.join(appData, "VSCodium"))) {
        filesToCreate.push(".clinerules");
        filesToCreate.push(".roomodes");
    }

    // 3. CLIs
    if (fs.existsSync(path.join(home, ".aider.conf.yml"))) filesToCreate.push(".aider.conf.yml");
    
    // 4. OpenInterpreter
    if (fs.existsSync(path.join(appData, "Open Interpreter"))) filesToCreate.push(".openinterpreter");

    // 5. Antigravity IDE (always inject)
    filesToCreate.push(".antigravityrules");

    // 6. Project-specific Subfolders
    if (fs.existsSync(".github")) filesToCreate.push(path.join(".github", "copilot-instructions.md"));
    if (fs.existsSync(".cody")) filesToCreate.push(path.join(".cody", "prompt"));
    if (fs.existsSync(".bolt")) filesToCreate.push(path.join(".bolt", "prompt"));
    if (fs.existsSync(".lovable")) filesToCreate.push(path.join(".lovable", "prompt"));

    filesToCreate.forEach(file => {
        const fullPath = path.join(cwd, file);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (file === '.aider.conf.yml') {
            // Aider requires 'system-prompt' (hyphenated) key in YAML
            const indented = globalPrompt.replace(/\r\n/g, '\n').replace(/\n/g, '\n  ');
            fs.writeFileSync(fullPath, `system-prompt: |\n  ${indented}`, 'utf8');
        } else if (file === '.roomodes') {
            // Roo Code expects a JSON object with customModes array
            const rooConfig = {
                customModes: [{
                    slug: 'seosona-master',
                    name: 'SEOSONA Master',
                    roleDefinition: globalPrompt,
                    groups: ['read', 'edit', 'browser', 'command', 'mcp']
                }]
            };
            fs.writeFileSync(fullPath, JSON.stringify(rooConfig, null, 2), 'utf8');
        } else {
            fs.writeFileSync(fullPath, globalPrompt, 'utf8');
        }
        console.log(`  -> Created ${file}`);
    });

    console.log("");
    console.log(colors.cyan("[SEOSONA] Project bound successfully. All AI assistants in this folder"));
    console.log(colors.cyan("          will now follow the project's SEOSONA rules."));
}

module.exports = { runInit };
