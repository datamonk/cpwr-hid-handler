// index.js
const createDataProcessor = require('./data-processor.js');

const processor = createDataProcessor();

// Listen for different events
processor.on('data', (chunk) => {
  console.log(`Received new chunk of data: ${chunk.length} bytes.`);
});

processor.on('complete', (fullBuffer) => {
  console.log('All data has been processed.');
  console.log(`Final buffer size: ${fullBuffer.length} bytes.`);
  // For demonstration, convert the buffer back to a string
  console.log(`Final data: ${fullBuffer.toString('utf8')}`);
});

processor.on('end', () => {
  console.log('--- Processing finished. ---');
});

processor.on('warning', (message) => {
  console.warn(`WARNING: ${message}`);
});

processor.on('error', (err) => {
  console.error(`ERROR: ${err.message}`);
});

// --- Start the process ---
console.log('--- Starting data stream simulation ---');

// Simulate receiving byte Buffer data over time
processor.addChunk(Buffer.from('Hello, '));
processor.addChunk(Buffer.from('World! '));
processor.addChunk(Buffer.from('This is a test.'));

// Signal to process all the buffered data
processor.processData();

// Simulate an invalid data chunk to trigger an error
console.log('\n--- Simulating invalid data ---');
processor.addChunk('This is not a buffer');
