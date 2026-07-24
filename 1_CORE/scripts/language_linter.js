const fs = require('fs');
const path = require('path');

const CORE_DIR = path.resolve(__dirname, '..', '..', '1_CORE');
const KNOWLEDGE_DIR = path.resolve(__dirname, '..', '..', '2_KNOWLEDGE');

// Regex for Vietnamese characters
const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

let hasError = false;

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('scripts') && file !== 'bin') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Allow files to explicitly opt-out if they contain valid Vietnamese data
            if (content.includes('seosona-ignore-lang')) continue;

            if (vnRegex.test(content)) {
                // Ignore SOUL.md which contains the Vietnamese Prime Directive quote
                if (file === 'SOUL.md') continue;
                
                console.error(`❌ VIOLATION DETECTED: Non-English characters found in cognitive file: ${fullPath}`);
                hasError = true;
            }
        }
    }
}

console.log('🛡️ SEOSONA Omni-Brain Linter: Checking Cognitive Language Policy...');
// We only scan areas that act as "AI Context" to prevent Context Drift.
// We explicitly DO NOT scan scripts/ or data/ folders since code often contains localized string literals.
// We also explicitly DO NOT scan 2_KNOWLEDGE and 4_AGENTS to allow localized SEO knowledge.
scanDir(CORE_DIR);

if (hasError) {
    console.error('\n🛑 LANGUAGE POLICY FAILED! System files must be 100% English.');
    process.exit(1);
} else {
    console.log('✅ ALL SYSTEM FILES COMPLY WITH ENGLISH-ONLY POLICY.');
    process.exit(0);
}
