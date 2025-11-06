//const logger = require('../lib/logger.js');
//const col = require('yoctocolors'); 

//const { devicePath } = require('./ups-hid-handler.js');


/**
 * Derives the charge status based on AC presence and charging states.
 * @param {boolean} acPresent - Whether AC power is present.
 * @param {boolean} charging - Whether the battery is currently charging.
 * @param {boolean} discharging - Whether the battery is currently discharging.
 * @param {boolean} fullyCharged - Whether the battery is fully charged.
 * @returns {string} - The derived charge status ('charging', 'discharging', 'full', 'unknown').
 */

const EventEmitter = require('events');
const ee = new EventEmitter();

class UpsHidParser {
  constructor(usageId, buffer, output) {
    this.usageId = usageId;
    this.buffer = buffer;
    this.output = output;
    this.acPresent = false;
    this.charging = false;
    this.discharging = false;
    this.fullyCharged = false;
  }

 /**
  * Parses the raw HID data buffer from the UPS.
  * @param {string} usageId - The report/usage ID in hex string format (e.g., '0x66').
  * @param {buffer} buffer - The raw data buffer from the HID device.
  * @param {object} output - The object to store parsed data.
  * @returns {object} - An object with the parsed UPS data.
  */
  parse() {
    if (this.buffer.length < 5) {
      return; // Ignore short or malformed reports
    };

    switch (this.usageId) {
      case '0x66':
        const remainingCapacity = this.buffer.readUInt16LE(4); // byte range (4-5)
        output.batteryPercentage = remainingCapacity;
        break;
      case '0x68':
       /** 
        * @note HUT 1.6 usage desc states 'Run Time to Empty' unit is in minutes..but it's 
        *       actually seconds. So we need to convert it to min here.
        * 
        * @ref  https://usb.org/sites/default/files/hut1_6.pdf#page=386&zoom=100,57,57
        */
        const runTimeSec = this.buffer.readUInt16LE(4); // byte range (4-5)
        const runTimeMin = Math.floor(runTimeSec / 60); // Convert sec > min
        output.runTimeToEmpty = runTimeMin;
        break;
      case '0xd0':
        this.acPresent = (this.buffer[4] & 0b00000001) !== 0;
        output.acPresent = this.acPresent;
        break;
      case '0x44':
        this.charging = (this.buffer[4] & 0b00000001) !== 0;
        break;
      case '0x45':
        this.discharging = (this.buffer[4] & 0b00000001) !== 0;
        break;
      case '0x46':
        this.fullyCharged = (this.buffer[4] & 0b00000001) !== 0;

        const chargeStatus = deriveChargeStatus(this.acPresent, this.charging, this.discharging, this.fullyCharged);
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
  }
}

module.exports = {
    UpsHidParser
};