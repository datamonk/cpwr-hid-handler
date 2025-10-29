/**
 * Read Through Pattern Caching method using flat file as database.
 * 
 * The core of the read-through pattern is a function that attempts 
 * to retrieve data from the cache first. If the data is a "cache miss" 
 * (not found in the cache), it then reads the data from the flat file, 
 * stores it in the cache, and finally returns the data.
 * 
 * @tests https://github.com/ptarjan/node-cache/blob/master/test.js
 * 
 * @see https://www.npmjs.com/package/node-cache
 */

const NodeCache = require('node-cache');
const fs = require('fs/promises'); // Using promises for async file operations

const myCache = new NodeCache({ stdTTL: 60 }); // Cache items expire after 60 seconds
//const flatFilePath = 'data.json'; // Your flat file
//const configPath = path.join(__dirname, '../config/.runtime-args.json');
const { config } = require('../config/config.js')

async function getFromCacheOrFile(key) {
    let data = myCache.get(key); // Try to get from cache

    if (data) {
        console.log('Cache hit for key:', key);
        return data;
    }

    console.log('Cache miss for key:', key, '. Reading from file...');
    try {
        //const fileContent = await fs.readFile(config, 'utf8');
        //const fileData = JSON.parse(fileContent);

        // Assuming your flat file is an object where keys match cache keys
        //data = fileData[key];

        const { appConfig } = require('../config/config.js')
        const objData = JSON.parse(appConfig);
        data = objData[key];

        if (data) {
            myCache.set(key, data); // Store in cache
            return data;
        } else {
            console.log('Data not found in flat file for key:', key);
            return null;
        }
    } catch (error) {
        console.error('Error reading or parsing flat file:', error);
        return null;
    }
}

// Example usage:
async function runExample() {
    // Simulate a first request (cache miss)
    //let user1 = await getFromCacheOrFile('user1');
    //console.log('User 1:', user1);
    let config = await getFromCacheOrFile('config');
    console.log('appConfig:', config);

    // Simulate a second request for the same data (cache hit)
    //let user1Again = await getFromCacheOrFile('user1');
    //console.log('User 1 (again):', user1Again);
    let configAgain = await getFromCacheOrFile('config');
    console.log('appConfig (again):', configAgain);

    // Simulate a request for different data
    //let user2 = await getFromCacheOrFile('user2');
    //console.log('User 2:', user2);
}

// Create a dummy data.json for the example
async function createDummyFile() {
    const dummyData = {
        user1: { id: 1, name: 'Alice' },
        user2: { id: 2, name: 'Bob' },
    };
    await fs.writeFile(config, JSON.stringify(dummyData, null, 2));
    console.log('Dummy data.json created.');
}

createDummyFile().then(runExample);