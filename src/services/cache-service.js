const { EventEmitter } = require('events');
const fs = require('fs/promises');
//const path = require('path');

//const configPath = path.join(__dirname, '../config/config.json');

function parseLogLevelArg(argv) {
  // Supports --logLevel=debug or --logLevel debug
  const arg = argv.find(a => a.startsWith('--logLevel'));
  if (!arg) return null;
  // Case: --logLevel=debug
  if (arg.includes('=')) {
    return arg.split('=')[1];
  }
  // Case: --logLevel debug
  const idx = argv.indexOf(arg);
  if (idx !== -1 && argv[idx + 1]) {
    return argv[idx + 1];
  }
  return null;
}

class CacheService extends EventEmitter {
  constructor(filePath = './cache.json') {
    super();
    this.filePath = filePath;
    this.cache = {};
    this._initialized = false;
  }

  async init() {
    if (this._initialized) return;
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.cache = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      await fs.writeFile(this.filePath, JSON.stringify({}));
      this.cache = {};
    }
    // Detect/accept logLevel override from CLI arg
    const logLevel = parseLogLevelArg(process.argv);
    if (logLevel) {
      if (!this.cache.config) this.cache.config = {};
      this.cache.config.logLevel = logLevel;
      // Persist immediately if overridden
      await fs.writeFile(this.filePath, JSON.stringify(this.cache, null, 2));
      this.emit('set', 'config.logLevel', logLevel);
    }
    this._initialized = true;
  }

  async get(key) {
    await this.init();
    return this.cache[key];
  }

  async set(key, value) {
    await this.init();
    this.cache[key] = value;
    await fs.writeFile(this.filePath, JSON.stringify(this.cache, null, 2));
    this.emit('set', key, value);
    return value;
  }

  async clear() {
    await this.init();
    this.cache = {};
    await fs.writeFile(this.filePath, JSON.stringify({}));
    this.emit('clear');
  }
}

module.exports = CacheService;