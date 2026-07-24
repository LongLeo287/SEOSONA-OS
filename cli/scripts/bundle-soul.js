const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', '..', '1_CORE', 'SOUL.md');
const destDir = path.join(__dirname, '..', 'assets');
const destPath = path.join(destDir, 'SOUL.md');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`[SEOSONA BUILD] Bundled SOUL.md into assets/`);
} else {
    console.warn(`[SEOSONA BUILD] Warning: Source SOUL.md not found at ${sourcePath}`);
}

const readmeSource = path.join(__dirname, '..', '..', 'README.md');
const readmeDest = path.join(__dirname, '..', 'README.md');
if (fs.existsSync(readmeSource)) {
    fs.copyFileSync(readmeSource, readmeDest);
    console.log(`[SEOSONA BUILD] Copied README.md into cli/`);
}
