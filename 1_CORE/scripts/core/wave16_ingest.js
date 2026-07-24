const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../../../2_KNOWLEDGE/raw_data/wave16_sources');
const OUTPUT_DIR = path.join(__dirname, '../../../2_KNOWLEDGE/frameworks/agent_skills');

const REPOS = ['json-render', 'markitdown'];

const VALID_EXTS = ['.md', '.ts', '.tsx', '.json', '.py', '.js'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'tests', '__pycache__'];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function processRepo(repoName) {
    console.log(`\n📦 Processing repository: ${repoName}...`);
    const repoDir = path.join(RAW_DIR, repoName);
    
    let fileCount = 0;

    function walkSync(currentDirPath) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            const filePath = path.join(currentDirPath, name);
            const stat = fs.statSync(filePath);
            
            if (stat.isFile()) {
                const ext = path.extname(filePath);
                if (VALID_EXTS.includes(ext)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.length > 500000 || content.trim() === '') return;

                    const relPath = path.relative(repoDir, filePath);
                    const safeName = slugify(relPath);
                    const skillName = `${repoName}_${safeName}`;
                    
                    // Create a dedicated folder for each skill
                    const skillFolder = path.join(OUTPUT_DIR, `wave16_${repoName}`, safeName);
                    if (!fs.existsSync(skillFolder)) {
                        fs.mkdirSync(skillFolder, { recursive: true });
                    }
                    
                    const yamlFrontmatter = `---
name: "${skillName}"
description: "Wave 16 Ingested file from ${repoName}: ${relPath}"
---

# ${skillName}
Source: \`${relPath}\`

\`\`\`${ext.substring(1)}
${content}
\`\`\`
`;
                    const outPath = path.join(skillFolder, `SKILL.md`);
                    fs.writeFileSync(outPath, yamlFrontmatter);
                    fileCount++;
                }
            } else if (stat.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(name)) {
                    walkSync(filePath);
                }
            }
        });
    }

    if (fs.existsSync(repoDir)) {
        walkSync(repoDir);
        console.log(`✅ Extracted ${fileCount} skills from ${repoName}.`);
    } else {
        console.log(`❌ Directory not found: ${repoDir}`);
    }
}

console.log("🚀 Starting Wave 16 Ingestion...");
REPOS.forEach(repo => processRepo(repo));
console.log("\n✅ Wave 16 Ingestion Complete!");
