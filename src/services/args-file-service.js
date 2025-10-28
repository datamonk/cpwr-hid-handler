const fs = require('fs');
const path = require('path');

/**
 * Writes an object to a temporary file and removes it on process exit.
 * @param {string} configPath The path to the temporary file.
 * @param {object} payload The data object to be written.
 */
function writeArgsFile(configPath, payload) {
  // Convert the object to a JSON string
  const jsonData = JSON.stringify(payload, null, 2);

  // Use a full path for reliability
  const fullPath = path.resolve(configPath);

  try {
    if (fs.existsSync(fullPath)) {
      console.log(`Detected pre-existing args file: ${fullPath}`);
      fs.unlinkSync(fullPath);
      console.log(`Successfully removed old args file`);
    }
    fs.writeFileSync(fullPath, jsonData); // attempt write of new config
    console.log(`Successfully wrote args config object to: ${fullPath}`);
  } catch (err) {
    console.error(`Error handling args config file: ${err.message}`);
  }

  // Cleanup function to be called on process exit
  process.on('exit', () => {
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Successfully removed temporary file: ${fullPath}`);
      }
    } catch (err) {
      console.error(`Error deleting args file on exit: ${err.message}`);
    }
  });

  // Handle uncaught exceptions to ensure cleanup is attempted
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
}

module.exports = {
    writeArgsFile
};