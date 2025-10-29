// __mocks__/fs.js

const path = require('path');
const mockFiles = Object.create(null);
const fs = jest.createMockFromModule('fs');

fs.writeFileSync = jest.fn((filepath, data) => {
  mockFiles[filepath] = data;
});

fs.readFileSync = jest.fn((filepath, encoding) => {
  if (mockFiles[filepath]) {
    return mockFiles[filepath];
  }
  throw new Error(`File not found: ${filepath}`);
});

fs.existsSync = jest.fn((filepath) => !!mockFiles[filepath]);

fs.unlinkSync = jest.fn((filepath) => {
  if (mockFiles[filepath]) {
    return; // noop delete
  }
  throw new Error(`File delete failed: ${filepath}`);
}); 

module.exports = {
    fs
};