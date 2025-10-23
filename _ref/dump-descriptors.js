const HID = require('node-hid');
const colors = require('yoctocolors');

console.log(colors.bgRedBright('Test'));

/**
 * @desc: Connect to the HID device using vendorId and productId or devicePath.
 *        I have found that using the device path is more reliable. With the 
 *        vendorId/productId method, the 'node-hid' module defaults to the /dev/hidraw*
 *        driver and I have noticed inconsistencies in the descriptor mappings. I'm sure
 *        with enough evaluation, it would be possible to identify the proper schema,
 *        but for now, using the /dev/usb/hiddev* path works perfectly fine so there isn't
 *        much value in spending time to support.
 * 
 * @note: You may need appropriate permissions to access the HID device. You can run 
 *        the script with sudo or adjust udev rules. See README.md for details.
 * 
 */

/** @globals */
// Vendor and Product IDs for the CyberPower SL950U UPS
const vendorId = 0x0764; // Vendor ID [Cyberpower]
const productId = 0x0501; // Product ID [SL950U]
// Vendor and Product IDs for the CyberPower PR1500LCDRT2U UPS
//const vendorId = 0x0764; // Vendor ID [Cyberpower]
//const productId = 0x0601; // Product ID [PR1500LCDRT2U]

const devicePath = "/dev/usb/hiddev0"; // Local device pointer
/***/

const device = new HID.HID(devicePath);

console.log(`Connecting device with Vendor ID: ${vendorId.toString(16)}, Product ID: ${productId.toString(16)}`);
console.log(`Connected to device: ${devicePath}`);

/**
* @desc   : HID report descriptor mapping to usageId/reportId hex value
*           [first byte] against usb.org hut v1.4 standard schema for 
*           'Battery System Page' [p.375].
* @ref    : https://usb.org/sites/default/files/hut1_4.pdf
* @output : Parsed HID Report Descriptor:
--
<Buffer 35 00 84 00 0f 00 00 00> - Manufacturer String [Str]
<Buffer 65 00 84 00 00 00 00 00> - Absolute State of Charge [DV] Sec. 31.4 [Battery Measures]: The predicted remaining battery capacity expressed as a percentage of
design capacity. (Units are %. The value may be greater than 100%.)
<Buffer 9e 00 01 ff 00 00 00 00> - Undefined
<Buffer 5a 00 84 00 01 00 00 00> - Reserved
<Buffer 2a 00 85 00 2c 01 00 00> - Remaining Time Limit [DV] Sec. 31.2 [Battery Controls]: Sets the value of the battery’s remaining time, which causes the RemainingTimeLimit control to be activated. Whenever
the battery’s remaining time falls below the value in the RemainingTimeLimit register, the battery periodically issues a RemainingTimeLimitExpired alarm. (Units are seconds.)
<Buffer 58 00 84 00 00 00 00 00> - Undefined
<Buffer 57 00 84 00 ff ff ff ff> - Undefined
<Buffer 56 00 84 00 ff ff ff ff> - Undefined
<Buffer 40 00 84 00 78 00 00 00> - Terminate Charge Voltage [Sel] Sec. 31.3.2 [Alarm]: The voltage at which the battery stops charging. (Units are mV.)
<Buffer 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00> - Remaining Capacity [DV] Sec. 31.4 [Battery Measures]: The predicted remaining capacity. (See CapacityMode for units.) 
                                                           & Reserved
<Buffer 68 00 85 00 dd 09 00 00> - Run Time to Empty [DV] Sec. 31.4 [Battery Measures]: The predicted remaining battery life, in minutes, at the present rate of discharge. The RunTimeToEmpty is calculated based on either current or power depending on the CapacityMode setting
<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00>
  - (d0) AC Present [DV] Sec. 31.7 [Charger Status]: Present/Not Present & 
    (44) Charging [Sel] & 
    (45) Discharging [Sel] & 
    (46) Full Charged [Sel] & 
    (43) Remaining Time Limit Expired [Sel] Sec. 31.3.2 [Alarm]: Has expired & 
    (42) Below Remaining Capacity Limit [Sel] Sec. 31.3.2 [Alarm]: Is below &
<Buffer 30 00 84 00 76 00 00 00 30 00 84 00 76 00 00 00> - Reserved
--
*/

const getFeatureReport = (reportId, reportLength) => {
  try {
    const report = device.getFeatureReport(reportId, reportLength);
    console.log(`Feature report ${reportId}:`, report);
    // You will need to parse this report buffer based on the descriptor
    // For example, convert a hex report to a string
    const reportAsString = report.toString('utf-8').trim();
    console.log(`Parsed string:`, reportAsString);
  } catch (err) {
    console.error(`Error reading feature report ${reportId}:`, err);
  }
};

const readInputReports = () => {
  device.on('data', (data) => {
    //console.log('Received input report:', data);
    console.log(data);
    // The data format depends on the descriptor.
    // Use the descriptor to interpret this buffer.
  });
  device.on('error', (err) => {
    console.error('HID device error:', err);
  });
};

getFeatureReport(1, 64);
readInputReports();