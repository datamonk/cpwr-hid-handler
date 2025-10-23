const HID = require('node-hid');

// Find your device. You may need to change these values.
// The device must send properly formatted JSON strings.
const devices = HID.devices(0x0764, 0x0501); // Vendor ID and Product ID of the target device
console.log(devices);

const devicePath = "/dev/usb/hiddev0";

//const myDevice = devices.find(d => d.path === devicePath);
//const myDevice = devices.find(d => d.vendorId === 0x0764 && d.productId === 0x0501);

//if (!myDevice) {
//  console.error("Device not found.");
//  process.exit(1);
//}

//const device = new HID.HID(myDevice.path);
const device = new HID.HID(devicePath);
//console.log(`Connected to device: ${myDevice.product} at ${myDevice.path}`);
//console.log(`Vendor ID: 0x${myDevice.vendorId.toString(16)}, Product ID: 0x${myDevice.productId.toString(16)}`);

// Accumulate chunks of data here.
let dataBuffer = '';

console.log(`Opened device: ${devicePath}`);
console.log('Listening for HID events...');

// Listen for the 'data' event from the HID device
device.on('data', (chunk) => {
  // Convert the buffer chunk to a UTF-8 string and add it to the buffer
  dataBuffer += chunk.toString('utf8');

  // Attempt to parse the accumulated buffer as JSON
  try {
    const parsedData = JSON.parse(dataBuffer);

    console.log('Received a complete JSON object:');
    console.log(parsedData);

    // You can now reset the buffer for the next JSON object
    dataBuffer = '';

  } catch (error) {
    // Parsing failed, which is expected for incomplete chunks.
    // The `dataBuffer` will continue to accumulate with the next chunk.
    // To see the incomplete chunks, uncomment the following line:
    console.log("Waiting for next chunk. Current buffer:", dataBuffer);
  }
});

// Listen for the 'error' event to handle issues with the device
device.on('error', (error) => {
  console.error('HID device error:', error);
  if (device) {
    device.close();
  };
  process.exit(1);
});

process.on('SIGINT', () => {
  console.warn('Caught interrupt signal (SIGINT). Closing device and exiting...');
  device.close();
  process.exit();
});