// __mocks__/node-hid.js
const EventEmitter = require('events');

// Mock a single HID device
class MockHIDDevice extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
    this.write = jest.fn();
    this.close = jest.fn();
  }
  
  // Method to simulate incoming data from the device
  // This is what you'll use in your tests to "send" canned data
  emitData(data) {
    this.emit('data', data);
  }
  
  // Method to simulate an error from the device
  emitError(err) {
    this.emit('error', err);
  }
}

// Mock the main `node-hid` module exports
const mockedDevices = [
  {
    path: 'mock-device-1',
    vendorId: 0x1234,
    productId: 0x5678,
  },
  {
    path: 'mock-device-2',
    vendorId: 0x9999,
    productId: 0xAAAA,
  },
];

const HID = {
  devices: jest.fn(() => mockedDevices),
  HID: jest.fn((vendorId, productId) => {
    // In a real device, you'd open a physical connection.
    // Here, we just return our mock device.
    const device = new MockHIDDevice('mock-path');
    
    // We can add logic to ensure the correct device is "opened"
    const foundDevice = mockedDevices.find(d => d.vendorId === vendorId && d.productId === productId);
    if (!foundDevice) {
      throw new Error('Device not found');
    }
    
    return device;
  })
};

// This is an alias for the constructor
// Use this in your tests to access the mock instance
HID.MockHIDDevice = MockHIDDevice;

module.exports = HID;