const fs = require('fs');
const path = require('path');
const os = require('os');
const { getSoulContent, getAppDataPath, colors } = require('./utils');

function injectJsonSettings(name, filePath, properties, globalPrompt) {
    const paddedName = `[${name}]`.padEnd(15, ' ');
    if (fs.existsSync(filePath)) {
        try {
            let raw = fs.readFileSync(filePath, 'utf8');
            if (!raw || raw.trim() === '') raw = '{}';
            const json = JSON.parse(raw);
            let injected = false;

            properties.forEach(prop => {
                const current = json[prop];
                if (current === undefined || current === null || current === '') {
                    json[prop] = globalPrompt;
                    injected = true;
                } else if (typeof current === 'string') {
                    if (!current.includes("SEOSONA")) {
                        json[prop] = globalPrompt;
                        injected = true;
                    }
                } else if (Array.isArray(current)) {
                    // Copilot's codeGeneration.instructions is an ARRAY OF OBJECTS. The old code ran
                    // Array.includes("SEOSONA") — which looks for that exact ELEMENT, never finds it,
                    // and replaced the whole array with a string: wrong type, and the user's entries
                    // gone. Append instead, and only once.
                    const already = current.some(e =>
                        (typeof e === 'string' && e.includes('SEOSONA')) ||
                        (e && typeof e === 'object' && JSON.stringify(e).includes('SEOSONA')));
                    if (!already) {
                        current.push({ text: globalPrompt });
                        injected = true;
                    }
                } else {
                    // An object or some other shape we don't understand — leave it alone rather
                    // than guess and destroy it.
                    console.log(`  -> ${paddedName} ${colors.yellow(`Skipped ${prop}: unexpected type ${typeof current}.`)}`);
                }
            });

            if (injected) {
                // Back up before the first modification. These files represent real user
                // configuration; there is no undo once we have written over them.
                const backup = `${filePath}.seosona-backup`;
                if (!fs.existsSync(backup)) fs.copyFileSync(filePath, backup);
                // Write via a temp file so an interrupted write cannot truncate the original.
                const tmp = `${filePath}.seosona-tmp`;
                fs.writeFileSync(tmp, JSON.stringify(json, null, 4), 'utf8');
                fs.renameSync(tmp, filePath);
                console.log(`  -> ${paddedName} ${colors.green('Injected global rules.')}`);
            } else {
                console.log(`  -> ${paddedName} ${colors.green('Already bound to SEOSONA.')}`);
            }
        } catch (e) {
            console.log(`  -> ${paddedName} ${colors.yellow('Found but failed to parse settings. Skipping.')}`);
        }
    } else {
        console.log(`  -> ${paddedName} ${colors.gray('Not detected. Skipping.')}`);
    }
}

function runSetup() {
    console.log("");
    console.log(colors.cyan("=========================================="));
    console.log(colors.cyan("   SEOSONA OS - UNIVERSAL SETUP CLI       "));
    console.log(colors.cyan("=========================================="));
    console.log("");

    const soulContent = getSoulContent();
    const globalPrompt = `You are the SEOSONA Master System. Your core directives are below:\n\n${soulContent}`;
    const appData = getAppDataPath();
    const home = os.homedir();

    console.log(colors.yellow("[1/2] Injecting into Detected IDEs..."));

    // JSON IDEs
    injectJsonSettings("Cursor", path.join(appData, "Cursor", "User", "settings.json"), ["cursor.general.rules"], globalPrompt);
    injectJsonSettings("Windsurf", path.join(appData, "Windsurf", "User", "settings.json"), ["windsurf.general.rules"], globalPrompt);
    injectJsonSettings("PearAI", path.join(appData, "PearAI", "User", "settings.json"), ["pearai.general.rules", "github.copilot.chat.codeGeneration.instructions"], globalPrompt);
    injectJsonSettings("Trae", path.join(appData, "Trae", "User", "settings.json"), ["trae.general.rules"], globalPrompt);
    
    const vscodeProps = ["github.copilot.chat.codeGeneration.instructions", "cline.customInstructions", "roo-cline.customInstructions"];
    injectJsonSettings("VSCode", path.join(appData, "Code", "User", "settings.json"), vscodeProps, globalPrompt);
    injectJsonSettings("VSCodium", path.join(appData, "VSCodium", "User", "settings.json"), vscodeProps, globalPrompt);
    injectJsonSettings("Continue.dev", path.join(home, ".continue", "config.json"), ["systemMessage"], globalPrompt);

    // OpenInterpreter (YAML)
    const openInterpConfig = path.join(appData, "Open Interpreter", "config.yaml");
    if (fs.existsSync(openInterpConfig)) {
        try {
            const raw = fs.readFileSync(openInterpConfig, 'utf8');
            if (!raw.includes("SEOSONA")) {
                const indented = globalPrompt.replace(/\r\n/g, '\n').replace(/\n/g, '\n  ');
                fs.appendFileSync(openInterpConfig, `\nsystem_message: |\n  ${indented}`, 'utf8');
                console.log(`  -> [OpenInterp]    ${colors.green('Injected global rules.')}`);
            } else {
                console.log(`  -> [OpenInterp]    ${colors.green('Already bound to SEOSONA.')}`);
            }
        } catch(e) {}
    } else {
        console.log(`  -> [OpenInterp]    ${colors.gray('Not detected. Skipping.')}`);
    }

    // Aider (YAML) — preserve all existing user settings, only update system-prompt
    const aiderConfig = path.join(home, ".aider.conf.yml");
    if (fs.existsSync(aiderConfig)) {
        const paddedAider = `[Aider CLI]`.padEnd(15, ' ');
        try {
            let existing = fs.readFileSync(aiderConfig, 'utf8');
            if (existing.includes('SEOSONA')) {
                console.log(`  ->  ${paddedAider} ${colors.green('Already bound to SEOSONA.')}`);
            } else {
                // Inject system-prompt at the top, keeping all other lines intact
                // Strip any pre-existing system-prompt block first
                const stripped = existing.replace(/^system-prompt:[\s\S]*?(?=^\S|\Z)/m, '').trim();
                const indented = globalPrompt.replace(/\r\n/g, '\n').replace(/\n/g, '\n  ');
                const updated = `system-prompt: |\n  ${indented}\n\n${stripped}`.trim() + '\n';
                fs.writeFileSync(aiderConfig, updated, 'utf8');
                console.log(`  ->  ${paddedAider} ${colors.green('Injected system-prompt (existing settings preserved.)')}`);
            }
        } catch(e) {
            console.log(`  ->  ${paddedAider} ${colors.yellow('Found but failed to update. Skipping.')}`);
        }
    } else {
        console.log(`  -> [Aider CLI]     ${colors.gray('Not detected. Skipping.')}`);
    }

    // Directory-based assistant injections (Mem0, Codex, SecureCoder, Ollama)
    function injectDirectoryAssistant(name, dirPath) {
        const paddedName = `[${name}]`.padEnd(15, ' ');
        if (fs.existsSync(dirPath)) {
            fs.writeFileSync(path.join(dirPath, "AGENTS.md"), globalPrompt, 'utf8');
            console.log(`  -> ${paddedName} ${colors.green('Injected AGENTS.md.')}`);
        } else {
            console.log(`  -> ${paddedName} ${colors.gray('Not detected. Skipping.')}`);
        }
    }

    console.log("");
    console.log(colors.yellow("[2/2] Injecting into Background AI Assistants..."));
    injectDirectoryAssistant("Mem0 Protocol", path.join(home, ".mem0"));
    injectDirectoryAssistant("Ollama Local", path.join(home, ".ollama"));
    injectDirectoryAssistant("Codex CLI", path.join(home, ".codex"));
    injectDirectoryAssistant("SecureCoder", path.join(home, ".securecoder"));

    // Portable-path root: when `seosona setup` is run from inside a cloned OS repo, link
    // ~/.seosona -> repo so every `~/.seosona/...` path resolves (mcp, capability bridge, KIs, the
    // project connector `seosona doctor` calls). A global npm install can't know the repo location —
    // there the repo's own `npm install` postinstall already created the link, so we skip quietly.
    console.log("");
    console.log(colors.yellow("[Portable Root] Linking ~/.seosona ..."));
    const repoRoot = path.resolve(__dirname, "..", "..");
    if (fs.existsSync(path.join(repoRoot, "1_CORE", "SOUL.md"))) {
        try {
            const { ensureJunction } = require(path.join(repoRoot, "1_CORE", "scripts", "lib", "ensure-junction.js"));
            const r = ensureJunction(repoRoot);
            if (r.status === "created") console.log(`  -> ${colors.green(`Linked ${r.link} -> ${r.target}`)}`);
            else if (r.status === "exists") console.log(`  -> ${colors.green("Already linked.")}`);
            else if (r.status === "occupied") console.log(`  -> ${colors.yellow(`${r.link} is a real folder — left untouched.`)}`);
            else console.log(`  -> ${colors.yellow(`Could not link: ${r.error}`)}`);
        } catch (e) {
            console.log(`  -> ${colors.yellow(`Skipped: ${e.message}`)}`);
        }
    } else {
        console.log(`  -> ${colors.gray("Global install — link is managed by the OS repo's own `npm install`.")}`);
    }

    console.log("");
    console.log(colors.cyan("=========================================="));
    console.log(`  SETUP COMPLETE!`);
    console.log(colors.cyan("=========================================="));
}

module.exports = { runSetup };
