// __mocks__/node-hid2.js

const mockDevices = {
    // Mock data for a keyboard
    'vid-1234-pid-5678': {
      manufacturer: 'Mock Corp',
      product: 'Mock Keyboard',
      interface: 0,
      path: 'mock-keyboard-path',
      reports: {
        'keypress-A': Buffer.from([0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]),
        'keypress-release': Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      },
    },
    // Mock data for a gamepad
    'vid-9876-pid-5432': {
      manufacturer: 'Game Mock Inc.',
      product: 'Mock Gamepad',
      interface: 0,
      path: 'mock-gamepad-path',
      reports: {
        'button-down-1': Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        'button-up-1': Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        'joystick-right': Buffer.from([0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      },
    },
  };
  
  const mockHid = {
    devices: () => {
      // Return a list of mocked devices
      return Object.entries(mockDevices).map(([id, dev]) => ({
        vendorId: parseInt(id.split('-')[1], 16),
        productId: parseInt(id.split('-')[2], 16),
        manufacturer: dev.manufacturer,
        product: dev.product,
        path: dev.path,
      }));
    },
  
    HID: jest.fn().mockImplementation((vid, pid) => {
      const deviceId = `vid-${vid.toString(16)}-pid-${pid.toString(16)}`;
      const mockDevice = mockDevices[deviceId];
      if (!mockDevice) {
        throw new Error('Device not found');
      }
  
      const listeners = {};
  
      return {
        write: jest.fn(),
        read: jest.fn(),
        setNonBlocking: jest.fn(),
        close: jest.fn(),
        on: jest.fn((event, callback) => {
          listeners[event] = callback;
        }),
        // Helper function for tests to simulate a data event
        _simulateData: (eventKey) => {
          if (listeners['data']) {
            listeners['data'](mockDevice.reports[eventKey]);
          }
        },
        // Helper function for tests to simulate an error event
        _simulateError: (error) => {
          if (listeners['error']) {
            listeners['error'](error);
          }
        },
      };
    }),
  };
  
  module.exports = mockHid;  