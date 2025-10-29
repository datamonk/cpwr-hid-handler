//const cache = require('memory-cache');
const NodeCache = require('node-cache');

/**
 * Pretty sure memory-cache is the legacy implementation for
 * node-cache..
 * @see https://www.npmjs.com/package/node-cache
 * @see https://www.npmjs.com/package/memory-cache
 */

const myCache = new NodeCache({ stdTTL: 60 });

//obj = { my: "Special", variable: 42 };
const obj = { 
  debugEnabled: false,
  prettyEnabled: false,
  onceModeEnabled: true,
  devicePath: "/dev/usb/hiddev1"
};
 
const success = myCache.set( "opts", obj, 10000 );
// true

const debug  = myCache.get( "opts" );
if ( value == undefined ){
    // handle cache miss!
}
// { my: "Special", variable: 42 }

//myCache.close(); // resets timeout for clean teardown

//myCache.flushAll(); // nuke all cache data
myCache.getStats();
/*
  {
    keys: 0,    // global key count
    hits: 0,    // global hit count
    misses: 0,  // global miss count
    ksize: 0,   // global key size count in approximately bytes
    vsize: 0    // global value size count in approximately bytes
  }
*/

/*
function getDataFromCache(key) {
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData;
  }

  const data = fetchDataFromSource();
  cache.put(key, data, 60000); // Cache for 60 seconds
  return data;
}
*/