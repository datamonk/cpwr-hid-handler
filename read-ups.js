const HID = require('node-hid');
const EventEmitter = require('events');
const colors = require('yoctocolors'); // @ref: https://github.com/sindresorhus/yoctocolors#readme
//console.log(colors.bgRedBright('Test'));

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
for (let i = 0; i < userArgs.length; i++) {
  if (userArgs[i] === '--verbose' || userArgs[i] === '-v') {
    var verboseEnabled = true;
    if (verboseEnabled) {
      logVerbose('Verbose mode enabled.');
    };
  } else if (userArgs[i] === '--report' || userArgs[i] === '-r') {
    var reportEnabled = true;
    if (reportEnabled) {
      logVerbose('Report descriptors selected.');
    };
  } else if (userArgs[i] === '--mode' || userArgs[i] === '-m') {
    if (i + 1 < userArgs.length) {
      const mode = userArgs[i + 1].toLowerCase();
      var onceModeEnabled = false;
      if (mode === 'once') {
        //console.warn('Setting runtime mode to once. The script will exit after a single read cycle.');
        onceModeEnabled = true;
      } else if (mode === 'stream') {
        //console.warn('Setting runtime mode to stream. The script will continue running and reading data.');
      } else {
        console.error('Invalid mode. Use "once" or "stream".');
        process.exit(1);
      };
    } else {
      console.error('No mode provided after --mode or -m flag.');
      process.exit(1);
    };
  } else if (userArgs[i] === '--help' || userArgs[i] === '-h') {
    console.log('Usage: node read-ups.js [--mode <once|stream>] [--verbose]');
    process.exit(0);
  };
};

function logVerbose(...messages) {
  if (verboseEnabled) {
    console.log(colors.bgWhiteBright('[VERBOSE]'), ...messages);
  };
};

function dumpDescriptors() {
  const getFeatureReport = (reportId, reportLength) => {
    try {
      ups = new HID.HID(devicePath);
      const report = ups.getFeatureReport(reportId, reportLength);
      console.log(`Feature report ${reportId}:`, report);
      // You will need to parse this report buffer based on the descriptor
      // For example, convert a hex report to a string
      const reportAsString = report.toString('utf-8').trim();
      console.log(`Parsed string:`, reportAsString);
    } catch (err) {
      console.error(`Error reading feature report ${reportId}:`, err);
    };
  };

  const readInputReports = () => {
    ups.on('data', (data) => {
      console.log('Received input report:', data);
      // @todo: Inject done emitter event when last expected usageId
      //        for a single iteration is seen to close the connection
      //        gracefully.
    });
    ups.on('error', (err) => {
      console.error('HID device error:', err);
      if (ups) {
        ups.close();
      };
    });
    process.on('SIGINT', () => {
      logVerbose('Caught interrupt signal (SIGINT). Closing device and exiting...');
      ups.close();
      process.exit();
    });
  };

  getFeatureReport(1, 64);
  readInputReports();
};

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
  logVerbose('Starting UPS HID handler...');
  logVerbose(`Looking for device with Vendor ID 0x${vendorId.toString(16)} and Product ID 0x${productId.toString(16)}...`);
  try {
    ups = new HID.HID(devicePath);
    logVerbose(`Opened device: ${devicePath}`);
    logVerbose('Listening for data... Press Ctrl+C to exit.');

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
              logVerbose('Closed device after single read cycle.');
              if (ups) {
                ups.close();
              };
              process.exit(0);
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
      logVerbose('Caught interrupt signal (SIGINT). Closing device and exiting...');
      ups.close();
      process.exit();
    });

  } catch (err) {
    console.error('Failed to open HID device:', err.message);
    console.error('Make sure the UPS is connected and you have permissions (e.g., udev rules on Linux).');
    setTimeout(startUpsHandler, 5000);
  };
};

if (devicePath && !reportEnabled) {
  startUpsHandler();
} else if (reportEnabled) {
  dumpDescriptors();
} else {
  console.error(`Device with Vendor ID 0x${vendorId.toString(16)} and Product ID 0x${productId.toString(16)} not found.`);
  process.exit(1);
};
