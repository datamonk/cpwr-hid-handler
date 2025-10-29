const logger = require('../helpers/logger.js');

function parseUsage(usageId, buffer, output) {
  if (buffer.length < 8) {
    logger.debug(`Ignoring short/malformed report for Usage ID ${usageId}: ${buffer.length} bytes`);
    return; // Ignore short or malformed reports
  };
  
  switch (usageId) {
    case '0x66':
      const remainingCapacity = buffer.readUInt16LE(4); // byte range (4-5)
      //output.batteryPercentage = remainingCapacity;
      return output = { batteryPercentage: remainingCapacity };
      //return { batteryPercentage: remainingCapacity };
      //break;
    case '0x68':
     /** 
      * @note HUT 1.6 usage desc states 'Run Time to Empty' unit is in minutes..but it's 
      *       actually seconds. So we need to convert it to min here.
      * 
      * @ref  https://usb.org/sites/default/files/hut1_6.pdf#page=386&zoom=100,57,57
      */
      //const runTimeSec = buffer.readUInt16LE(4); // byte range (4-5)
      const runTimeMin = Math.floor(buffer.readUInt16LE(4) / 60); // Convert sec > min
      //output.runTimeToEmpty = runTimeMin;
      return output = { runTimeToEmpty: runTimeMin };
      //break;
    case '0xd0':
      const acPresent = (buffer[4] & 0b00000001) !== 0;
      //output.acPresent = acPresent;
      return output = { acPresent: acPresent };
    case '0x44':
      const charging = (buffer[4] & 0b00000001) !== 0;
      return output = { charging: charging };
      //break;
    case '0x45':
      const discharging = (buffer[4] & 0b00000001) !== 0;
      return output = { discharging: discharging };
      //break;
    case '0x46':
      const fullyCharged = (buffer[4] & 0b00000001) !== 0;
      return output = { fullyCharged: fullyCharged };

      //const chargeStatus = deriveChargeStatus(acPresent, charging, discharging, fullyCharged);
      //output.chargeStatus = chargeStatus;
      /** 
        * @note Since this is a synchronous read, we can reasonably assume this is the last id
        *       we are going to parse data from. Add timestamp, devicePath to the output object
        *       and signal a 'done' state to the emitter. There is still a secondary check later to
        *       ensure all keys are present before output is dumped to stdout. Otherwise, another
        *       read cycle will be evaluated.
        */
      //output.path = devicePath;
      //const currentTime = new Date();
      //const epochTime = Math.floor(currentTime.getTime() / 1000);
      //output.ts = epochTime;
      //break;
    default:
      throw new Error(`Unknown Usage ID: ${usageId}`);
      //break;
  };
};

module.exports = { parseUsage };
