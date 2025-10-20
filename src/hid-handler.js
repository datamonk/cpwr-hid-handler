// src/hid-handler.js
const HID = require('node-hid');
const { Buffer } = require('buffer');

/**
 * A class to handle communication with a specific HID device.
 */
class HidHandler {
  constructor(vendorId, productId) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.device = null;
    this.receivedData = [];
  }
  
  // Connects to the HID device and sets up the data listener
  connect() {
    try {
      this.device = new HID.HID(this.vendorId, this.productId);
      
      this.device.on('data', (data) => {
        // Handle the incoming buffer data
        this.receivedData.push(data);
        console.log('Received data:', data.toString('hex'));
      });
      
      this.device.on('error', (err) => {
        console.error('HID device error:', err);
      });
      
      console.log('Connected to HID device.');
    } catch (error) {
      console.error('Failed to connect to HID device:', error);
      this.device = null;
    }
  }
  
  // Disconnects from the device
  disconnect() {
    if (this.device) {
      this.device.close();
      this.device = null;
    }
  }
  
  // Writes data to the device
  write(data) {
    if (this.device) {
      this.device.write(data);
    }
  }
}

module.exports = HidHandler;