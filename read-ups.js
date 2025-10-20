const HID = require('node-hid'); // @ref: https://github.com/node-hid/node-hid/blob/master/README.md
const col = require('yoctocolors'); // @ref: https://github.com/sindresorhus/yoctocolors#readme

const EventEmitter = require('events');
const ee = new EventEmitter(); // Event emitter instance to handle state of parsing lifecycle

/** @globals */
// Vendor and Product IDs for the CyberPower SL950U UPS
const vendorId = 0x0764; // Vendor ID [Cyberpower]
const productId = 0x0501; // Product ID [SL950U]

// Vendor and Product IDs for the CyberPower PR1500LCDRT2U UPS
//const vendorId = 0x0764; // Vendor ID [Cyberpower]
//const productId = 0x0601; // Product ID [PR1500LCDRT2U]

// Local device pointer
var devicePath = "/dev/usb/hiddev0"; // Default device path if not overridden with opt.
// Report/Usage IDs to parse
const usagesToParse = [
  '0x66', '0x68', '0xd0', '0x44', '0x45', '0x46'
]; 
// Static order for JSON object elements
const keyOrder = [
  'ts', 'path', 'batteryPercentage', 'acPresent', 'runTimeToEmpty', 'chargeStatus'
];
// Init JSON object for parsed report data
let reportData = {}; 
// HID device i/o instance
let ups; 
// default states
let acPresent = false;
let charging = false;
let discharging = false;
let fullyCharged = false;
/***/

const userArgs = process.argv.slice(2);
for (let i = 0; i < userArgs.length; i++) {
  if (userArgs[i] === '--verbose' || userArgs[i] === '-v') {
    var verboseEnabled = true;
    logVerbose('Verbose mode enabled.');
  } else if (userArgs[i] === '--pretty' || userArgs[i] === '-p') {
    var prettyEnabled = true;
    logVerbose('Pretty print enabled.');
  } else if (userArgs[i] === '--device' || userArgs[i] === '-d') {
    if (i + 1 < userArgs.length) {
      devicePath = userArgs[i + 1].toLowerCase();
      logVerbose('Device path set to:', devicePath);
    } else {
      console.error('No device path provided after --device or -d flag.');
      process.exit(1);
    };
  } else if (userArgs[i] === '--mode' || userArgs[i] === '-m') {
    if (i + 1 < userArgs.length) {
      const mode = userArgs[i + 1].toLowerCase();
      var onceModeEnabled = true; // default to once
      if (mode === 'once') {
        // noop since default is already true
      } else if (mode === 'stream') {
        onceModeEnabled = false;
      } else {
        console.error('Invalid mode. Use "once" or "stream".');
        process.exit(1);
      };
    } else {
      console.error('No mode provided after --mode or -m flag.');
      process.exit(1);
    };
  } else if (userArgs[i] === '--help' || userArgs[i] === '-h') {
    console.log('Usage: node read-ups.js [--mode <once|stream>] [--device </path/to/dev>] [--verbose] [--pretty]');
    process.exit(0);
  };
};

var JSONstringifyRaw = function(arr) {
  var str='<Buffer ';
  for (var i = 0; i < arr.length-1; i++) {
    str += arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=' '; }
  };
  str += '>';
  str = col.magentaBright(str);
  return str;
};

var JSONstringifyHex = function(arr) {
  var str='[';
  for (var i = 0; i < arr.length-1; i++) {
    str += '0x' + arr[i].toString(16).padStart(2, '0');
    if(i<arr.length-2) { str+=', '; }
  }
  str += ']';
  str = col.cyanBright(str);
  return str;
};

function logVerbose(...messages) {
  if (verboseEnabled) {
    console.log(`[${col.bgGray(`${col.bold('DEBUG')}`)}]`, ...messages);
  };
};

function splitBufferIntoChunks(buffer, chunkSize) {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  };
  return chunks;
};

function deriveChargeStatus(acPresent, charging, discharging, fullyCharged) {
  let chargeStatus;
  const states = {
    acPresent: acPresent,
    charging: charging,
    discharging: discharging,
    fullyCharged: fullyCharged
  };
  logVerbose('Evaluating charge states:', states);

  if (fullyCharged && acPresent) {
    chargeStatus = "fully-charged";
  } else if (charging && acPresent) {
    chargeStatus = "charging";
  } else if (discharging && !acPresent) {
    chargeStatus = "discharging";
  } else {
    // Catch all remaining unknown states
    chargeStatus = "undefined";
  };
  logVerbose('Derived charge status:', col.bold(`${chargeStatus}`));
  return chargeStatus;
};

function parseHidData(usageId, buffer, output) {
 /**
  * Parses the raw HID data buffer from the UPS.
  * @param {string} usageId - The report/usage ID in hex string format (e.g., '0x66').
  * @param {buffer} data - The raw data buffer from the HID device.
  * @param {object} output - The object to store parsed data.
  * @returns {object} - An object with the parsed UPS data.
  */

  if (buffer.length < 5) {
    return; // Ignore short or malformed reports
  };

  switch (usageId) {
    case '0x66':
      const remainingCapacity = buffer.readUInt16LE(4); // byte range (4-5)
      output.batteryPercentage = remainingCapacity;
      break;
    case '0x68':
     /** 
      * @note HUT 1.6 usage desc states 'Run Time to Empty' unit is in minutes..but it's 
      *       actually seconds. So we need to convert it to min here.
      * 
      * @ref  https://usb.org/sites/default/files/hut1_6.pdf#page=386&zoom=100,57,57
      */
      const runTimeSec = buffer.readUInt16LE(4); // byte range (4-5)
      const runTimeMin = Math.floor(runTimeSec / 60); // Convert sec > min
      output.runTimeToEmpty = runTimeMin;
      break;
    case '0xd0':
      acPresent = (buffer[4] & 0b00000001) !== 0;
      output.acPresent = acPresent;
      break;
    case '0x44':
      charging = (buffer[4] & 0b00000001) !== 0;
      break;
    case '0x45':
      discharging = (buffer[4] & 0b00000001) !== 0;
      break;
    case '0x46':
      fullyCharged = (buffer[4] & 0b00000001) !== 0;

      const chargeStatus = deriveChargeStatus(acPresent, charging, discharging, fullyCharged);
      output.chargeStatus = chargeStatus;

      /** 
       * @note Since this is a synchronous read, we can reasonably assume this is the last id
       *       we are going to parse data from. Add timestamp, devicePath to the output object
       *       and signal a 'done' state to the emitter. There is still a secondary check later to
       *       ensure all keys are present before output is dumped to stdout. Otherwise, another
       *       read cycle will be evaluated.
       */
      output.path = devicePath;
      const currentTime = new Date();
      const epochTime = Math.floor(currentTime.getTime() / 1000);
      output.ts = epochTime;
      
      ee.emit('done');
      break;
    default:
      // Skip all other ID's seen even though we are checking for permitted ones with
      // 'usagesToParse' prior to the case statement.
      break;
  };
};

function startUpsHandler() {
 /**
  * @desc Kickoff the main HID event read handler
  */
  logVerbose('Starting UPS HID handler...');
  logVerbose(`Looking for device with Vendor ID ${col.bold(`0x${vendorId.toString(16)}`)} and Product ID ${col.bold(`0x${productId.toString(16)}`)}...`);
  try {
    ups = new HID.HID(devicePath);
    logVerbose(`Opened device: ${col.bold(`${devicePath}`)}`);
    logVerbose('Listening for data... Press Ctrl+C to exit.');

    ups.on('data', function (data) {
      /**
       * @note Split into 8-byte chunks from the raw buffer received since various UPS models
       *       send multiple reports concatenated in a single Buffer message. By splitting
       *       into chunks, we can parse consistently for each Usage ID regardless of the
       *       initial event length.
       */
      logVerbose(`Raw buffer length: ${col.yellowBright(`${data.length}`)} bytes`);
      const chunks = splitBufferIntoChunks(data, 8);
      
      chunks.forEach((chunk) => {
        logVerbose(`Received [${col.italic('raw')}]: ${JSONstringifyRaw(chunk)}`);
        logVerbose(`Received [${col.italic('hex')}]: ${JSONstringifyHex(chunk)}`);
        const reportId = chunk[0];
        const reportIdHex = `0x${reportId.toString(16).padStart(2, '0')}`;

        if (usagesToParse.includes(reportIdHex)) {
          parseHidData(reportIdHex, chunk, reportData);
          ee.once('done', () => {
            const entries = Object.entries(reportData);
            entries.sort((a, b) => {
              const indexA = keyOrder.indexOf(a[0]);
              const indexB = keyOrder.indexOf(b[0]);
              return indexA - indexB;
            });
            const orderedReportData = Object.fromEntries(entries);
            
            if (Object.keys(orderedReportData).length === 0) {
              // Skip empty outputs dumped to STDOUT. This will omit
              // unwanted reset emitted output.
              return;
            } else if (Object.keys(orderedReportData).length < 6) {
              logVerbose('Incomplete buffer data received for finished payload, consuming from next read cycle..');
              return;
            };
            // Output the final parsed report data to stdout
            if (prettyEnabled) {
              console.log(JSON.stringify(orderedReportData, null, 2)); // pretty-printed
            } else {
              console.log(JSON.stringify(orderedReportData)); // condensed
            };
            /**
             * @output
             * {
                 "ts": 1760837972,
                 "path": "/dev/usb/hiddev0",
                 "batteryPercentage": 100,
                 "acPresent": true,
                 "runTimeToEmpty": 40,
                 "chargeStatus": "fully-charged"
              }
             */
            ee.emit('reset'); // signal reset event for next read cycle
          });
          ee.once('reset', () => {
            if (onceModeEnabled) {
              logVerbose('Closed device after single read cycle.');
              if (ups) {
                ups.close();
              };
              process.exit(0);
            } else {
              reportData = {}; // clear any content from last iteration.
              ee.removeAllListeners('done');
              ee.removeAllListeners('reset');
            };
          });
        };
      });
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

if (devicePath) {
  startUpsHandler();
} else {
  console.error(`Device with Vendor ID 0x${vendorId.toString(16)} and Product ID 0x${productId.toString(16)} not found.`);
  process.exit(1);
};
