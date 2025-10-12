const HID = require('node-hid');
const EventEmitter = require('events');

/** @globals */
// Vendor and Product IDs for the CyberPower SL950U UPS
const vendorId = 0x0764; // Vendor ID [Cyberpower]
const productId = 0x0501; // Product ID [SL950U]
// Vendor and Product IDs for the CyberPower PR1500LCDRT2U UPS
//const vendorId = 0x0764; // Vendor ID [Cyberpower]
//const productId = 0x0601; // Product ID [PR1500LCDRT2U]

const devicePath = "/dev/usb/hiddev0"; // Local device pointer
const usagesToParse = ['0x66', '0x68', '0xd0']; // Report/Usage IDs to parse

const ee = new EventEmitter(); // Event emitter to signal state of parsing lifecycle
let ups; // HID device instance
const reportData = {}; // Init JSON obj for parsed report data
// Desired key order for final output
const keyOrder = ['ts', 'path', 'batteryPercentage', 'acPresent', 'runTimeToEmpty', 'chargeStatus'];
/***/

const userArgs = process.argv.slice(2);
// Simple arg parser for --device or -d flag to specify device path
for (let i = 0; i < userArgs.length; i++) {
  if (userArgs[i] === '--mode' || userArgs[i] === '-m') {
    if (i + 1 < userArgs.length) {
      const mode = userArgs[i + 1].toLowerCase();
      var onceModeEnabled = false;
      if (mode === 'once') {
        console.warn('Setting runtime mode to once. The script will exit after a single read cycle.');
        onceModeEnabled = true;
      } else if (mode === 'stream') {
        console.warn('Setting runtime mode to stream. The script will continue running and reading data.');
        //onceModeEnabled = false;
      } else {
        console.error('Invalid mode. Use "once" or "stream".');
        process.exit(1);
      }
    } else {
      console.error('No mode provided after --mode or -m flag.');
      process.exit(1);
    }
  } else if (userArgs[i] === '--help' || userArgs[i] === '-h') {
    console.log('Usage: node read-ups.js [--mode <once|stream>]');
    process.exit(0);
  }
}

/**
 * Parses the raw HID data buffer from the UPS.
 * @param {string} usageId - The report/usage ID in hex string format (e.g., '0x66').
 * @param {buffer} data - The raw data buffer from the HID device.
 * @param {object} output - The object to store parsed data.
 * @returns {object} - An object with the parsed UPS data.
 */
function parseHidData(usageId, buffer, output) {
  if (buffer.length < 5) {
    return; // Ignore short or malformed reports, seems to speed up processing..
  };

  switch (usageId) {
    case '0x66':
      const remainingCapacity = buffer.readUInt16LE(4); // Bytes 4-5

      output.batteryPercentage = remainingCapacity;
      break;
    case '0x68':
      /** hut1.6 usage desc states 'Run Time to Empty' unit is in minutes..but its 
       * actually seconds. So we need to convert it to min here.
       * @ref: https://usb.org/sites/default/files/hut1_6.pdf#page=386&zoom=100,57,57
       */
      const runTimeSec = buffer.readUInt16LE(4); // Bytes 4-5
      const runTimeMin = Math.floor(runTimeSec / 60); // convert to min

      output.runTimeToEmpty = runTimeMin;
      break;
    case '0xd0':
      const acPresent = (buffer[4] & 0b00000001) !== 0;
      const charging = (buffer[12] & 0b00000001) !== 0;
      const discharging = (buffer[20] & 0b00000001) !== 0;
      const fullyCharged = (buffer[28] & 0b00000001) !== 0;
      let chargeStatus = "undefined";

      if (charging && acPresent && !discharging && !fullyCharged) {
        chargeStatus = "charging"; // State when on AC power and charging
      } else if (discharging && !charging && !fullyCharged) {
        chargeStatus = "discharging"; // State when on battery and discharging
      } else if (fullyCharged && acPresent && !charging && !discharging) {
        chargeStatus = "fully-charged"; // State when on AC power and fully charged
      };
      output.acPresent = acPresent;
      output.chargeStatus = chargeStatus;

      /** Since this is a synchronous read, we can safely assume this is the last id
       * we are going to parse data from. Add timestamp, devicePath to the output object
       * and signal a done state to the emitter. Ensuring a complete data object is gtg.
       */
      output.ts = new Date().toISOString();
      output.path = devicePath;
      ee.emit('done');
      break;
    default: break; // Skip all other ids
  };
};

/**
 * Kickoff the HID event handler for reading from the UPS device.
 */
function startUpsHandler() {
  //console.log('Starting UPS HID handler...');
  try {
    ups = new HID.HID(devicePath);
    //console.log(`Opened device: ${devicePath}`);
    //console.log('Listening for data... Press Ctrl+C to exit.');

    ups.on('data', function (data) {
      const reportId = data[0];
      const reportIdHex = `0x${reportId.toString(16).padStart(2, '0')}`;

      if (usagesToParse.includes(reportIdHex)) {
        parseHidData(reportIdHex, data, reportData);
        if (reportIdHex === '0xd0') {
          ee.once('done', () => {
            const entries = Object.entries(reportData);
            entries.sort((a, b) => {
              const indexA = keyOrder.indexOf(a[0]);
              const indexB = keyOrder.indexOf(b[0]);
              return indexA - indexB;
            });
            const orderedReportData = Object.fromEntries(entries);
            console.log(JSON.stringify(orderedReportData, null, 2));
            /**
             * @output:
             * {
                 "ts": "2025-10-12T03:19:11.546Z",
                 "path": "/dev/usb/hiddev0",
                 "batteryPercentage": 100,
                 "acPresent": true,
                 "runTimeToEmpty": 42,
                 "chargeStatus": "fully-charged"
               }
             */
            if (onceModeEnabled) {
              ups.close();
              //console.log('Closed device after single read cycle.');
            } else {
              // Reset reportData for next read cycle
              for (const key in reportData) {
                if (reportData.hasOwnProperty(key)) {
                  delete reportData[key];
                };
              };
            };
          });
        };
      };
    });

    ups.on('error', function (err) {
      console.error('HID device error:', err);
      if (ups) {
        ups.close();
      };
      setTimeout(startUpsHandler, 5000);
    });

    process.on('SIGINT', () => {
      console.log('\nClosing device and exiting.');
      ups.close();
      process.exit();
    });

  } catch (err) {
    console.error('Failed to open HID device:', err.message);
    console.error('Make sure the UPS is connected and you have permissions (e.g., udev rules on Linux).');
    setTimeout(startUpsHandler, 5000);
  };
};

if (devicePath) {
  startUpsHandler();
} else {
  console.error(`Device with Vendor ID 0x${vendorId.toString(16)} and Product ID 0x${productId.toString(16)} not found.`);
  process.exit(1);
};
