const fs = require('fs');
const path = require('path');
const os = require('os');

function getSoulContent() {
    const assetPath = path.join(__dirname, '..', 'assets', 'SOUL.md');
    if (fs.existsSync(assetPath)) {
        return fs.readFileSync(assetPath, 'utf8');
    }
    // Fallback for development if not built
    const devPath = path.join(__dirname, '..', '..', '1_CORE', 'SOUL.md');
    if (fs.existsSync(devPath)) {
        return fs.readFileSync(devPath, 'utf8');
    }
    return "SEOSONA Master System (Fallback rule due to missing SOUL.md)";
}

function getAppDataPath() {
    const platform = os.platform();
    const home = os.homedir();
    if (platform === 'win32') {
        return process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    } else if (platform === 'darwin') {
        return path.join(home, 'Library', 'Application Support');
    } else {
        return path.join(home, '.config');
    }
}

const colors = {
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    gray: (text) => `\x1b[90m${text}\x1b[0m`,
};

module.exports = {
    getSoulContent,
    getAppDataPath,
    colors
};
