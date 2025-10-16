
/**
 * Iterates through a Node.js Buffer containing byte data.
 * Logs each byte's decimal and hexadecimal representation.
 *
 * @param {Buffer} buffer The Buffer object to iterate.
 */
function iterateByteBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      console.error("Input is not a valid Buffer object.");
      return;
    }
  
    console.log("Iterating through Buffer:");
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      console.log(`Index ${i}: Decimal = ${byte}, Hex = 0x${byte.toString(16).padStart(2, '0')}`);
    }
  
    // Alternatively, using a for...of loop (more concise for simple iteration)
    // console.log("\nIterating using for...of loop:");
    // let index = 0;
    // for (const byte of buffer) {
    //   console.log(`Index ${index}: Decimal = ${byte}, Hex = 0x${byte.toString(16).padStart(2, '0')}`);
    //   index++;
    // }
  
    // Or using forEach
    // console.log("\nIterating using forEach:");
    // buffer.forEach((byte, index) => {
    //   console.log(`Index ${index}: Decimal = ${byte}, Hex = 0x${byte.toString(16).padStart(2, '0')}`);
    // });
  }
  
  // Example usage:
  // Create a Buffer from an array of numbers (representing byte values)
  const cannedData = Buffer.from([0x01, 0x1D, 0x00, 0xFF, 0x0A, 0xBE, 0xEF]);
  iterateByteBuffer(cannedData);
  
  // Create a Buffer from a string (using UTF-8 encoding by default)
  const stringData = Buffer.from("Hello");
  iterateByteBuffer(stringData);