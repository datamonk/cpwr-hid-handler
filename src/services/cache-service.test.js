const CacheService = require('./cache-service');
const fs = require('fs/promises');
//const path = require('path');

/**
 * @note update snapshots with
 *   $ node ./node_modules/jest/bin/jest.js --updateSnapshot   
 */

const { restoreCacheFileFromSnapshot } = require('./helpers/restoreFromSnapshot');
//const TEST_CACHE_FILE = path.join(__dirname, '../config/config.json');
const TEST_CACHE_FILE = './cache.json';

describe('CacheService(): with CLI override for config.logLevel', () => {
  let cache;

  beforeEach(async () => {
    // Clean up before each test
    try { await fs.unlink(TEST_CACHE_FILE); } catch (e) {}
    // We remove any logLevel left in process.argv
    //process.argv = process.argv.filter(a => !a.startsWith('--logLevel'));
    cache = new CacheService(TEST_CACHE_FILE);
  });

  afterAll(async () => {
    try { await fs.unlink(TEST_CACHE_FILE); } catch (e) {}
  });

  test('should set and persist a known value (snapshot)', async () => {
    await cache.set('foo', { bar: 42 });
    const fileContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    // Save the initial cache file as a named snapshot
    //expect(fileContents).toMatchSnapshot('cache-file-canned-state');
    expect(fileContents).toMatchSnapshot('cache-file-after-set');
  });

  test('should clear cache and restore from snapshot using helper', async () => {
    // Create and snapshot cache
    await cache.set('foo', { bar: 42 });
    const beforeClearContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    expect(beforeClearContents).toMatchSnapshot('cache-file-before-clear');

    // Clear cache
    await cache.clear();
    const clearedContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    expect(clearedContents).toEqual('{}');

    // Restore cache file from snapshot using helper
    await restoreCacheFileFromSnapshot(TEST_CACHE_FILE, 'cache-file-before-clear');

    // Reinitialize cache and verify restore
    const cacheRestored = new CacheService(TEST_CACHE_FILE);
    await cacheRestored.init();
    expect(await cacheRestored.get('foo')).toEqual({ bar: 42 });
  });

  test.skip('should override config.logLevel from CLI --logLevel=debug', async () => {
    process.argv.push('--logLevel=debug');
    //cache = new CacheService(TEST_CACHE_FILE);
    await cache.init();

    // Direct property
    expect(cache.cache.config.logLevel).toBe('debug');
    // File updated
    const fileContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    const fileCache = JSON.parse(fileContents);
    expect(fileCache.config.logLevel).toBe('debug');
  });

  test.skip('should override config.logLevel from CLI --logLevel info', async () => {
    process.argv.push('--logLevel', 'info');
    //cache = new CacheService(TEST_CACHE_FILE);
    await cache.init();

    expect(cache.cache.config.logLevel).toBe('info');
    const fileContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    const fileCache = JSON.parse(fileContents);
    expect(fileCache.config.logLevel).toBe('info');
  });

  test.skip('should preserve logLevel from cache file when no CLI override given', async () => {
    // Write out an initial logLevel
    await fs.writeFile(
      TEST_CACHE_FILE,
      JSON.stringify({ config: { logLevel: 'warn' } }, null, 2)
    );
    //cache = new CacheService(TEST_CACHE_FILE);
    await cache.init();

    expect(cache.cache.config.logLevel).toBe('warn');
  });

  test.skip('should emit set event when logLevel overridden by CLI', async () => {
    const listener = jest.fn();
    process.argv.push('--logLevel=error');
    //cache = new CacheService(TEST_CACHE_FILE);
    cache.on('set', listener);
    await cache.init();

    // Should emit for config.logLevel
    expect(listener).toHaveBeenCalledWith('config.logLevel', 'error');
  });

  test.skip('should set and get other keys', async () => {
    //cache = new CacheService(TEST_CACHE_FILE);
    await cache.set('foo', { bar: 42 });
    expect(await cache.get('foo')).toEqual({ bar: 42 });
  });

  test.skip('should clear cache correctly', async () => {
    //cache = new CacheService(TEST_CACHE_FILE);
    await cache.set('key', 'val');
    await cache.clear();
    expect(cache.cache).toEqual({});
    const fileContents = await fs.readFile(TEST_CACHE_FILE, 'utf8');
    expect(JSON.parse(fileContents)).toEqual({});
  });
});