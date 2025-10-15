/**
 * Converts a raw USB-HID byte buffer into a structured JavaScript object.
 *
 * @param {Buffer} buffer The raw USB-HID data as a Node.js Buffer.
 * @returns {object} The parsed report data.
 * @throws {Error} If the buffer is not the expected size or format.
 */
function parseHidReport(buffer) {
    // Validate buffer size based on your device's report descriptor
    if (buffer.length !== 8) {
      throw new Error(`Expected a buffer of 8 bytes, but received ${buffer.length}.`);
    }
  
    // Define bitmask for individual buttons (based on your descriptor)
    const buttons = {
      button1: 0x01, // Corresponds to bit 0
      button2: 0x02, // Corresponds to bit 1
      button3: 0x04, // Corresponds to bit 2
    };
  
    // Extract values according to the HID report structure
    const reportId = buffer.readUInt8(0);
    const buttonStates = buffer.readUInt8(1);
    const xAxis = buffer.readInt16LE(2); // 16-bit signed integer (Little Endian)
    const yAxis = buffer.readInt16LE(4); // 16-bit signed integer (Little Endian)
  
    // Interpret button states from the bitmask
    const parsedButtons = Object.keys(buttons).reduce((acc, buttonName) => {
      acc[buttonName] = (buttonStates & buttons[buttonName]) !== 0;
      return acc;
    }, {});
  
    // Return the parsed data in a friendly format
    return {
      reportId,
      buttons: parsedButtons,
      axes: {
        x: xAxis,
        y: yAxis
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
  const cannedData = Buffer.from([0x01, 0x03, 0x1A, 0x00, 0xFC, 0xFF, 0x00, 0x00]);
  
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