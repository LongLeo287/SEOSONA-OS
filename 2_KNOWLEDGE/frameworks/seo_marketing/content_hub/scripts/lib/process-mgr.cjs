/**
 * Process manager - handles PID files and server lifecycle
 * Used by content-hub server
 */

const fs = require('fs');
const path = require('path');

const PID_DIR = '/tmp';
const PID_PREFIX = 'content-hub-';

function getPidFilePath(port) {
  return path.join(PID_DIR, `${PID_PREFIX}${port}.pid`);
}

function writePidFile(port, pid) {
  fs.writeFileSync(getPidFilePath(port), String(pid));
}

function readPidFile(port) {
  const pidPath = getPidFilePath(port);
  if (fs.existsSync(pidPath)) {
    return parseInt(fs.readFileSync(pidPath, 'utf8').trim(), 10);
  }
  return null;
}

function removePidFile(port) {
  const pidPath = getPidFilePath(port);
  if (fs.existsSync(pidPath)) fs.unlinkSync(pidPath);
}

function findRunningInstances() {
  const instances = [];
  const files = fs.readdirSync(PID_DIR);

  for (const file of files) {
    if (file.startsWith(PID_PREFIX) && file.endsWith('.pid')) {
      const port = parseInt(file.replace(PID_PREFIX, '').replace('.pid', ''), 10);
      const pid = readPidFile(port);
      if (pid) {
        try {
          process.kill(pid, 0);
          instances.push({ port, pid });
        } catch {
          removePidFile(port);
        }
      }
    }
  }
  return instances;
}

function stopServer(port) {
  const pid = readPidFile(port);
  if (!pid) return false;
  try {
    process.kill(pid, 'SIGTERM');
    removePidFile(port);
    return true;
  } catch {
    removePidFile(port);
    return false;
  }
}

function stopAllServers() {
  const instances = findRunningInstances();
  let stopped = 0;
  for (const { port, pid } of instances) {
    try {
      process.kill(pid, 'SIGTERM');
      removePidFile(port);
      stopped++;
    } catch {
      removePidFile(port);
    }
  }
  return stopped;
}

function setupShutdownHandlers(port, cleanup) {
  const handler = () => {
    if (cleanup) cleanup();
    removePidFile(port);
    process.exit(0);
  };
  process.on('SIGTERM', handler);
  process.on('SIGINT', handler);
}

module.exports = {
  getPidFilePath,
  writePidFile,
  readPidFile,
  removePidFile,
  findRunningInstances,
  stopServer,
  stopAllServers,
  setupShutdownHandlers,
  PID_PREFIX
};
