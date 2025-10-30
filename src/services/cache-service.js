
/**
 * @note Read through caching is a method where the cache itself is responsible
 *       for both serving data and populating itself when it encounters a cache
 *       miss. When a client requests data, it queries the cache. If the data
 *       isn't in the cache (a cache miss), the cache retrieves the data from 
 *       the primary data store and then serves it to the client, ensuring it's
 *       also saved in the cache for subsequent requests.
 * 
 * @see https://www.techlivened.com/implementing-caching-in-node-js
 */

const EventEmitter = require('events');
const fs = require('fs/promises');
const path = require('path');

const configPath = path.join(__dirname, '../config/config.json');

class CacheService extends EventEmitter {
  constructor() {
    super();
    this.data = new Map();
    this.ttl = new Map();
  };

  async fsGet(key) {
    try {
      const fileContent = await fs.readFile(configPath, 'utf8');
      const fileData = JSON.parse(fileContent);
      return fileData[key];
    } catch (error) {
      console.error('Error reading or parsing flat file:', error);
      return null;
    };
  };

  async readConfig(key, ttlValue) {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      let data = await this.fsGet(key); // Cache miss, grab content from file
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

  async readArgs(key) {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      console.error('The cached args obj does not exist.', error);
      return null;
    };
  };

};

module.exports = {
    CacheService
};
