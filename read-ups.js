const HID = require('node-hid');
const EventEmitter = require('events');

const vendorId = 0x0764; // Replace with your device's Vendor ID
const productId = 0x0501; // Replace with your device's Product ID
const devicePath = "/dev/usb/hiddev0"; // Local device pointer
const reportsToParse = ['0x66', '0x68', '0xd0']; // Report/Usage IDs to parse

const doneEmitter = new EventEmitter(); // Event emitter to signal when parsing is done
const reportData = {}; // Init JSON obj for parsed report data
let upsDevice; // HID device instance

function parseHidReport(reportId, buffer, outputObject) {
  if (buffer.length < 5) {
    return; // Ignore short or malformed reports, seems to speed up processing..
  };
  switch (reportId) {
    case '0x66':
      const remainingCapacity = buffer.readUInt16LE(4); // Bytes 4-5
      const runTimeToEmpty = buffer.readUInt16LE(8); // Bytes 8-9

      outputObject.remainingCapacity = remainingCapacity;
      outputObject.runTimeToEmpty = runTimeToEmpty;
      break;
    case '0x68':
      const runTimeSec = buffer.readUInt16LE(4); // Bytes 4-5
      const runTimeMin = Math.floor(runTimeSec / 60); // convert to minutes

      outputObject.runTimeMin = runTimeMin;
      break;
    case '0xd0':
      const acPresent = (buffer[4] & 0b00000001) !== 0;
      const charging = (buffer[12] & 0b00000001) !== 0;
      const discharging = (buffer[20] & 0b00000001) !== 0;
      const fullyCharged = (buffer[28] & 0b00000001) !== 0;
      let chargerStatus = "Undefined";

      if (charging && acPresent && !discharging && !fullyCharged) {
        chargerStatus = "Charging"; // State when on AC power and charging
      } else if (discharging && !charging && !fullyCharged) {
        chargerStatus = "Discharging"; // State when on battery and discharging
      } else if (fullyCharged && acPresent && !charging && !discharging) {
        chargerStatus = "Fully Charged"; // State when on AC power and fully charged
      } else if (!acPresent && !charging && !discharging && !fullyCharged) {
        chargerStatus = "On Battery"; // State when on battery and not charging
      };
      outputObject.acPresent = acPresent;
      outputObject.chargerStatus = chargerStatus;

      // Via synchronous read(s), we know this is the last report id we are
      // going to parse data from so add a timestamp to the output object and 
      // signal our custom emitter that we are done. This will ensure
      // we have final complete data object before returning it downstream.
      outputObject.timestamp = new Date().toISOString();
      doneEmitter.emit('done');
      break;
    default:
      break; // Skip ids we don't care about
  };
};

function startUpsHandler() {
  console.log('Starting UPS HID handler...');
  try {
    upsDevice = new HID.HID(devicePath);
    //console.log(`Opened device: ${targetDevice.product}`);
    console.log(`Opened device: ${devicePath}`);
    console.log('Listening for data... Press Ctrl+C to exit.');

    upsDevice.on('data', function (data) {
      const reportId = data[0];
      const reportIdHex = `0x${reportId.toString(16).padStart(2, '0')}`;
      //console.log(`Received report ID: ${reportIdHex}, Data:`, data);
      if (reportsToParse.includes(reportIdHex)) {
        parseHidReport(reportIdHex, data, reportData);

        if (reportIdHex === '0xd0') {
          doneEmitter.once('done', () => {
            console.log('Final JSON object:', JSON.stringify(reportData, null, 2));
          });
        };
        //console.log('Updated JSON object:', JSON.stringify(reportData, null, 2));
      };
    });

    upsDevice.on('error', function (err) {
      console.error('HID device error:', err);
      if (upsDevice) {
        upsDevice.close();
      };
      setTimeout(startUpsHandler, 5000); // Attempt to reconnect after a delay
    });

    process.on('SIGINT', () => {
      console.log('\nClosing device and exiting.');
      upsDevice.close();
      process.exit();
    });

  } catch (err) {
    console.error('Failed to open HID device:', err.message);
    console.error('Make sure the UPS is connected and you have permissions (e.g., udev rules on Linux).');
    setTimeout(startUpsHandler, 5000); // Attempt to reconnect
  };
};

if (devicePath) {
  startUpsHandler();
} else {
  console.error(`Device with Vendor ID 0x${vendorId.toString(16)} and Product ID 0x${productId.toString(16)} not found.`);
  process.exit(1);
};
