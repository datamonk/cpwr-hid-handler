
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

class ReadThroughCache extends EventEmitter {
    constructor() {
        super();
        this.data = new Map();
        this.ttl = new Map(); // for simulating Time-To-Live values
    }

    // Simulate reading from a database
    async dbGet(key) {
        // In a real scenario, this would interact with a database.
        return `Data for ${key}`;
    }

    async readThrough(key, ttlValue) {
        if (this.data.has(key)) {
            return this.data.get(key);
        } else {
            // Cache miss scenario
            let data = await this.dbGet(key);
            this.data.set(key, data);

            // Setting TTL (Optional)
            this.ttl.set(key, ttlValue);
            setTimeout(() => this.data.delete(key), ttlValue);

            return data;
        }
    }
}

/**
 * @usage example
const cache = new ReadThroughCache();

(async function demo() {
    console.log(await cache.readThrough('user1', 5000)); // Fetches from "database", sets in cache
    console.log(await cache.readThrough('user1', 5000)); // Fetches from cache
})();
*/

/**
const optsCache = {};
function setCache(key, value) {
  optsCache[key] = value;
}
function getCache(key) {
  return optsCache[key];
}
module.exports = {
  setCache,
  getCache,
};
*/
