const { EventEmitter } = require('events');

// Create a custom class that inherits from EventEmitter
class DataProcessor extends EventEmitter {
  constructor() {
    super();
    this.bufferChunks = [];
  }

  // Method to add new Buffer data
  addChunk(chunk) {
    if (!Buffer.isBuffer(chunk)) {
      // It's good practice to validate input
      this.emit('error', new Error('Provided data is not a Buffer.'));
      return;
    }
    this.bufferChunks.push(chunk);
    // Emit a 'data' event with the new chunk
    this.emit('data', chunk);
  }

  // Method to finalize and process the collected data
  processData() {
    if (this.bufferChunks.length === 0) {
      this.emit('warning', 'No data to process.');
      this.emit('end');
      return;
    }

    // Concatenate all buffer chunks into a single Buffer
    const fullBuffer = Buffer.concat(this.bufferChunks);

    // Emit a 'complete' event with the final, concatenated Buffer
    this.emit('complete', fullBuffer);

    // After processing, clear the internal state
    this.bufferChunks = [];

    // Emit an 'end' event to signal that the process is finished
    this.emit('end');
  }
}

// Export a factory function to create new instances of our class
module.exports = () => new DataProcessor();
