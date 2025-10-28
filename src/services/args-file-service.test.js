const fs = require('fs');
const path = require('path');

const { writeArgsFile } = require('./tmp-file-writer.js');

// Example of a runtime argument object
const myArgs = {
  user: 'jane_doe',
  id: 123,
  permissions: ['read', 'write'],
  lastAccess: new Date().toISOString(),
};

console.log(__dirname);

const filePath = path.join(__dirname, '../config/.runtime-args.json');

// Call the function to write the data and set up the cleanup
writeArgsFile(filePath, myArgs);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
      return;
  }
  console.log('File contents:', data);
});

// Once the runtime process exits, the handler should delete the file.