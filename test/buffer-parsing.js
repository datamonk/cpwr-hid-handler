
//const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // Hello

// 68 00 85 00 dd 09 00 00
// 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00

//const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

//const buffer = Buffer.from([0x68, 0x00, 0x85, 0x00, 0xdd, 0x09, 0x00, 0x00]);
const buffer = Buffer.from([0x66, 0x00, 0x85, 0x00, 0x64, 0x00, 0x00, 0x00, 0x30, 0x00, 0x84, 0x00, 0x8C, 0x00, 0x00, 0x00]);
const remainingCapacity = buffer.readUInt16LE(4);


// Read 16-bit unsigned integer from position 4
//const runTimeSec = buffer.readUInt16LE(4); // Bytes 4-5
//const runTimeMin = Math.floor(runTimeSec / 60); // convert to min

console.log('Raw Buffer:', buffer);
console.log('Buffer Length:', buffer.length);

//const substr = buffer.toString('utf8', 0, 3); // decode 0-3 byte range
//const substr = buffer.toString('utf8', 0, buffer.length); // expand range based on length

//console.log('Converted String:', substr);
//console.log('Converted Int:', runTimeMin, 'min');
console.log('Converted Int:', remainingCapacity);