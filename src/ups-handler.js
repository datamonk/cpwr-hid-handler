// src/ups-handler.js

const HID = require('node-hid');
const col = require('yoctocolors'); 

const EventEmitter = require('events');
const ee = new EventEmitter();

const { Logger } = require('../lib/logger.js');
const logger = new Logger(false); // Default boolean to enable debug logs

const { splitBufferIntoChunks, JSONstringifyRaw, JSONstringifyHex } = require('../lib/common.js');
const { parseHidData } = require('./hid-parser.js');

/**
 * @desc Main class to handle communication with an UPS instance via HID.
 */
class UpsHidHandler {
  constructor(vendorId, productId, devicePath) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.devicePath = devicePath;
    this.ups = null;
    this.reportData = {};
    this.keyOrder = [
        'ts', 'path', 'batteryPercentage', 'acPresent', 'runTimeToEmpty', 'chargeStatus'
    ];
    this.usagesToParse = [
        '0x66', '0x68', '0xd0', '0x44', '0x45', '0x46'
    ];
  };
  
  // Connect to the HID device and kickoff the event read listener.
  connect() {
    logger.debug('Starting UPS HID handler...');
    logger.debug(`Looking for device with Vendor ID ${col.bold(`0x${this.vendorId.toString(16)}`)} and Product ID ${col.bold(`0x${this.productId.toString(16)}`)}...`);
    try {
      //this.device = new HID.HID(this.vendorId, this.productId);
      this.ups = new HID.HID(this.devicePath);
      logger.debug(`Opened device: ${col.bold(`${this.devicePath}`)}`);
      logger.debug('Listening for data... Press Ctrl+C to exit.');
      
      this.ups.on('data', (data) => {

      /**
       * @note Split into 8-byte chunks from the raw buffer received since various UPS models
       *       send multiple reports concatenated in a single Buffer message. By splitting
       *       into chunks, we can parse consistently for each Usage ID regardless of the
       *       initial event length.
       */
      logger.debug(`Raw buffer length: ${col.yellowBright(`${data.length}`)} bytes`);
      const chunks = splitBufferIntoChunks(data, 8);
      
      chunks.forEach((chunk) => {
        logger.debug(`Received [${col.italic('raw')}]: ${JSONstringifyRaw(chunk)}`);
        logger.debug(`Received [${col.italic('hex')}]: ${JSONstringifyHex(chunk)}`);
        const reportId = chunk[0];
        const reportIdHex = `0x${reportId.toString(16).padStart(2, '0')}`;

        if (this.usagesToParse.includes(reportIdHex)) {
          parseHidData(reportIdHex, chunk, this.reportData);
          ee.once('done', () => {
            const entries = Object.entries(this.reportData);
            entries.sort((a, b) => {
              const indexA = this.keyOrder.indexOf(a[0]);
              const indexB = this.keyOrder.indexOf(b[0]);
              return indexA - indexB;
            });
            const orderedReportData = Object.fromEntries(entries);
            
            if (Object.keys(orderedReportData).length === 0) {
              // Skip empty outputs dumped to STDOUT. This will omit
              // unwanted reset emitted output.
              return;
            } else if (Object.keys(orderedReportData).length < 6) {
              logger.debug('Incomplete buffer data received for finished payload, consuming from next read cycle..');
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
              logger.debug('Closed device after single read cycle.');
              if (ups) {
                ups.close();
              };
              process.exit(0);
            } else {
              this.reportData = {}; // clear any content from last iteration.
              ee.removeAllListeners('done');
              ee.removeAllListeners('reset');
            };
          });
        };
      });
      });
      
      this.ups.on('error', (err) => {
        console.error('HID device error:', err);
        if (ups) {
          ups.close();
        };
        //setTimeout(connect, 5000);
      });
      process.on('SIGINT', () => {
      logger.debug('Caught interrupt signal (SIGINT). Closing device and exiting...');
      ups.close();
      process.exit();
    });
      
      console.log('Connected to HID device.');
    } catch (err) {
      console.error('Failed to open HID device:', err.message);
      console.error('Make sure the UPS is connected and you have permissions (e.g., udev rules on Linux).');
      this.ups = null;
    }
  }
  
  // Disconnects gracefully from the device
  disconnect() {
    if (this.ups) {
      this.ups.close();
      this.ups = null;
    }
  }
  
}

module.exports = {
    UpsHidHandler
};