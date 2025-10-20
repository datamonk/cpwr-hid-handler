const HID = require('node-hid');

const devices = HID.devices();
const cpwrDevices = devices.filter(d => d.manufacturer === 'CPS');

if (cpwrDevices.length === 0) {
  console.log('No Cyber Power Systems devices found.');
} else {
  console.log('Detected Cyber Power Systems devices:');
  //console.log(cpwrDevices); // dump raw json response
  
  cpwrDevices.forEach((device, index) => {
    console.log(`Device ${index + 1}:`);
    console.log(`  Manufacturer: ${device.manufacturer}`);
    console.log(`  Product: ${device.product}`);
    console.log(`  Vendor ID: ${device.vendorId.toString(16)}`);
    console.log(`  Product ID: ${device.productId.toString(16)}`);
    console.log(`  Path: ${device.path}`);
    console.log(`  Serial Number: ${device.serialNumber}`);
    console.log('---------------------------');
  });
};