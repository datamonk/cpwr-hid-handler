// src/hid-handler.test.js
const UpsHidHandler = require('./ups-hid-handler.js');
const HID = require('node-hid');
const { Buffer } = require('buffer');

// Jest will automatically use the manual mock in __mocks__
// when it sees this import.
jest.mock('node-hid');

describe.todo('controllers/ups-hid-handler.js', () => {

  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe.skip('UpsHidHandler(): todo', () => {
    let handler;
    let mockDeviceInstance;
    const vendorId = 0x1234;
    const productId = 0x5678;

    beforeAll(() => { //
    });
    afterAll(() => { //
    });
    beforeEach(() => {
      jest.clearAllMocks();
      handler = new UpsHidHandler(vendorId, productId);
      mockDeviceInstance = HID.HID.mock.results[0]?.value;
    });
    afterEach(() => { //
    });

    test.skip('should connect to the HID device and listen for data', () => {
      handler.connect();

      // The mock HID constructor should have been called
      expect(HID.HID).toHaveBeenCalledWith(vendorId, productId);
    
      // The mock device instance should have listeners attached
      expect(mockDeviceInstance.on).toHaveBeenCalledWith('data', expect.any(Function));
      expect(mockDeviceInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    test.skip('should handle incoming canned buffer data correctly', () => {
      handler.connect();
    
      // Define the canned buffer data you want to test
      const cannedData1 = Buffer.from([0x01, 0x02, 0x03, 0x04]);
      const cannedData2 = Buffer.from([0x05, 0x06, 0x07, 0x08]);

      // Use the `emitData` helper on the mock instance to simulate a report
      mockDeviceInstance.emitData(cannedData1);
      mockDeviceInstance.emitData(cannedData2);
    
      // Now, test that your handler processed the data as expected
      expect(handler.receivedData).toEqual([cannedData1, cannedData2]);
    });
  
    test.skip('should write data to the device', () => {
      handler.connect();
    
      const outputData = Buffer.from([0xAA, 0xBB, 0xCC]);
      handler.write(outputData);
    
      // Verify that the mock device's `write` method was called with the correct data
      expect(mockDeviceInstance.write).toHaveBeenCalledWith(outputData);
    });
  
    test.skip('should close the device connection', () => {
      handler.connect();
      handler.disconnect();
    
      // Verify that the mock device's `close` method was called
      expect(mockDeviceInstance.close).toHaveBeenCalled();
    });
  });

});