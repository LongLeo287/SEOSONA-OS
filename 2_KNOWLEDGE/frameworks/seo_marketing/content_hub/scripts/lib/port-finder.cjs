/**
 * Port finder utility - finds available port in range
 * Used by content-hub server
 */

const net = require('net');

const DEFAULT_PORT = 3457; // Different from markdown-novel-viewer (3456)
const PORT_RANGE_END = 3500;

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

/**
 * Find first available port in range
 */
async function findAvailablePort(startPort = DEFAULT_PORT) {
  for (let port = startPort; port <= PORT_RANGE_END; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port in range ${startPort}-${PORT_RANGE_END}`);
}

module.exports = {
  isPortAvailable,
  findAvailablePort,
  DEFAULT_PORT,
  PORT_RANGE_END
};
