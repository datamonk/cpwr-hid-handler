/**
 * Converts a raw USB-HID byte buffer into a structured JavaScript object.
 *
 * @param {Buffer} buffer The raw USB-HID data as a Node.js Buffer.
 * @returns {object} The parsed report data.
 * @throws {Error} If the buffer is not the expected size or format.
 */
function parseHidReport(buffer) {
    // Validate buffer size based on your device's report descriptor
    //if (buffer.length !== 8) {
    //  throw new Error(`Expected a buffer of 8 bytes, but received ${buffer.length}.`);
    //}
    if (buffer.length < 5) {
      return; // Ignore short or malformed reports, seems to speed up processing..
    };
  
    // Define bitmask for individual buttons (based on your descriptor)
    //const schema = {
    //  button1: 0x01, // Corresponds to bit 0
    //  button2: 0x02, // Corresponds to bit 1
    //  button3: 0x04, // Corresponds to bit 2
    //};
  
    // Extract values according to the HID report structure
    //const reportId = buffer.readUInt8(0);
    //const buttonStates = buffer.readUInt8(1);
    //const xAxis = buffer.readInt16LE(2); // 16-bit signed integer (Little Endian)
    //const yAxis = buffer.readInt16LE(4); // 16-bit signed integer (Little Endian)
    //const reportId = buffer.readUInt8(0);
    //const reportIdHex = `0x${reportId.toString(16).padStart(2, '0')}`;
    const reportId = `0x${buffer.readUInt8(0).toString(16).padStart(2, '0')}`;
    const battery = buffer.readUInt16LE(4); // 0x66 - remainingCapacity
    //const runTimeSec = buffer.readUInt16LE(4); // Bytes 4-5
    const time = Math.floor(buffer.readUInt16LE(4) / 60); // 0x68 - convert to min
    const acPresent = (buffer[4] & 0b00000001) !== 0; // 0xd0
    const charging = (buffer[12] & 0b00000001) !== 0; // 0xd0
    const discharging = (buffer[20] & 0b00000001) !== 0; // 0xd0
    const fullyCharged = (buffer[28] & 0b00000001) !== 0; // 0xd0
  
    // Interpret button states from the bitmask
    //const parsedButtons = Object.keys(schema).reduce((acc, buttonName) => {
    //  acc[buttonName] = (buttonStates & schema[buttonName]) !== 0;
    //  return acc;
    //}, {});
  
    // Return the parsed data in a friendly format
    //return {
    //  reportId,
    //  buttons: parsedButtons,
    //  axes: {
    //    x: xAxis,
    //    y: yAxis
    //  }
    //};

    return {
      reportId,
      bufferLen: buffer.length,
      payload: {
        time,
        battery,
        acPresent,
        charging,
        discharging,
        fullyCharged
      }
    };
  }
  
  // --- Canned Data Example ---
  // Simulate a buffer from your HID device
  // In this example:
  // Byte 0: 0x01 (Report ID)
  // Byte 1: 0x03 (Button 1 and Button 2 are pressed)
  // Bytes 2-3: 0x00, 0x1A (X-axis = 26)
  // Bytes 4-5: 0xFC, 0xFF (Y-axis = -4)
  const cannedDataOne = Buffer.from([0x66, 0x00, 0x85, 0x00, 0x64, 0x00, 0x00, 0x00, 0x30, 0x00, 0x84, 
    0x00, 0x8C, 0x00, 0x00, 0x00
  ]);
  const cannedDataTwo = Buffer.from([0x68, 0x00, 0x85, 0x00, 0xdd, 0x09, 0x00, 0x00]);
  const cannedDataThree = Buffer.from([0xD0, 0x00, 0x85, 0x00, 0x01, 0x00, 0x00, 0x00, 0x44, 0x00, 0x85, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x45, 0x00, 0x85, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46, 0x00, 0x85, 0x00, 
    0x01, 0x00, 0x00, 0x00, 0x43, 0x00, 0x85, 0x00, 0x00, 0x00, 0x00, 0x00, 0x42, 0x00, 0x85, 0x00, 0x00, 
    0x00, 0x00, 0x00
  ]);
  
function main (cannedData) {
  try {
    const parsedData = parseHidReport(cannedData);
    console.log('Parsed HID Report:', parsedData);
    // Expected output:
    // {
    //   reportId: 1,
    //   buttons: { button1: true, button2: true, button3: false },
    //   axes: { x: 26, y: -4 }
    // }
  
  } catch (error) {
    console.error(error.message);
  }
}

main(cannedDataOne);
main(cannedDataTwo);
main(cannedDataThree);
