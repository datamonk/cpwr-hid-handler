const EventEmitter = require('events');
const fs = require('fs/promises');
const path = require('path');

const configPath = path.join(__dirname, '../config/config.json');

/**
 * @see https://www.techlivened.com/implementing-caching-in-node-js
 */

class CacheService extends EventEmitter {
  constructor() {
    super();
    this.data = new Map();
    this.ttl = new Map();
  };

  async readFs(key) {
    try {
      const fileContent = await fs.readFile(configPath, 'utf8');
      const fileData = JSON.parse(fileContent);
      return fileData[key];
    } catch (error) {
      console.error('Error reading or parsing flat file:', error);
      return null;
    };
  };

  async getConfig(key, ttlValue) {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      let data = await this.readFs(key); // Cache miss, grab content from file
      this.data.set(key, data);
      this.ttl.set(key, ttlValue);  // Set TTL [Optional]
      setTimeout(() => this.data.delete(key), ttlValue);
      return data;
    };
  };

  async setArgs(key, data, ttlValue) {
    if (this.data.has(key)) {
      return this.data.get(key); // If already exists, just return that data.
    } else {
      this.data.set(key, data);  
      this.ttl.set(key, ttlValue);  // Set TTL [Optional]
      setTimeout(() => this.data.delete(key), ttlValue);
      return data;
    };
  };

  async getArgs(key) {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      console.error('The cached args obj does not exist.', key);
      return null;
    };
  };

};

/**
 * @note The below syntax exports a single instance of the CacheService class
 *       which is critical for the caching service to work correctly with a
 *       global context.
 */
module.exports = new CacheService();

