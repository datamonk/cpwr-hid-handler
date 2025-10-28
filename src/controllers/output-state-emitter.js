const EventEmitter = require('events');

class OutputStateEmitter extends EventEmitter {
  constructor() {
    super();
    this.data = 'initial state';
  }

  updateData(newData) {
    this.data = newData;
    this.emit('dataUpdated', this.data); // Emit event with current state
  }

  getData() {
    return this.data;
  }
}

const myObject = new OutputStateEmitter();

// Register a listener for the 'dataUpdated' event
myObject.on('dataUpdated', (newData) => {
  console.log(`Data updated to: ${newData}`);
});

// Update the data, which will emit the 'dataUpdated' event
myObject.updateData('new state value');

// Register an error listener
myObject.on('error', (err) => {
  console.error('An error occurred:', err.message);
});

// Emit an error event
myObject.emit('error', new Error('Something went wrong!'));