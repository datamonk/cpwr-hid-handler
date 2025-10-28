const fs = require('fs');
const path = require('path');

/**
 * Writes an object to a temporary file and removes it on process exit.
 * @param {string} filePath The path to the temporary file.
 * @param {object} data The data object to be written.
 */
function writeArgsFile(filePath, data) {
  // Convert the object to a JSON string
  const jsonData = JSON.stringify(data, null, 2);

  // Use a full path for reliability
  const fullPath = path.resolve(filePath);

  try {
    // Write the JSON data to the file synchronously
    fs.writeFileSync(fullPath, jsonData);
    console.log(`Successfully wrote data to temporary file: ${fullPath}`);
  } catch (err) {
    console.error(`Error writing file: ${err.message}`);
    // If writing fails, we still want to set up the cleanup to be safe
  }

  // Set up the cleanup function to be called on process exit
  process.on('exit', () => {
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Successfully removed temporary file: ${fullPath}`);
      }
    } catch (err) {
      console.error(`Error deleting file on exit: ${err.message}`);
    }
  });

  // Handle uncaught exceptions to ensure cleanup is attempted
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with a failure code
  });
}

module.exports = {
    writeArgsFile
};