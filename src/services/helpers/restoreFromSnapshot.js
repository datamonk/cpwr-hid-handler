// helpers/restoreFromSnapshot.js
const fs = require('fs/promises');

/**
 * Restores the cache file from a Jest snapshot.
 * @param {string} cacheFilePath
 * @param {string} snapshotName
 */
async function restoreCacheFileFromSnapshot(cacheFilePath, snapshotName) {
  // Access the snapshot data from expect's state.
  const snapData = expect.getState().snapshotState._snapshotData[snapshotName];
  if (snapData) {
    await fs.writeFile(cacheFilePath, snapData);
  } else {
    throw new Error(`Snapshot "${snapshotName}" not found`);
  }
}

module.exports = { restoreCacheFileFromSnapshot };