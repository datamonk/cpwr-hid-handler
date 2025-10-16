
/**
 * Converts a raw USB-HID byte buffer into a structured JavaScript object.
 *
 * @param {Buffer} buffer The raw USB-HID data as a Node.js Buffer.
 * @returns {object} The parsed report data.
 * @throws {Error} If the buffer is not the expected size or format.
 */
function parseHidReport(buffer) {
    if (buffer.length < 5) {
      //throw new Error(`Expected a buffer of atleast 5 bytes, but received ${buffer.length}.`);
      return; // Ignore short or malformed reports, seems to speed up processing..
    };
  
    // Define bitmask for individual buttons (based on your descriptor)

    /**
    <Buffer 66 00 85 00 64 00 00 00 30 00 84 00 8c 00 00 00> - Remaining Capacity [DV] Sec. 31.4 [Battery Measures]: The predicted remaining capacity. (See CapacityMode for units.) 
                                                           & Reserved

    <Buffer 68 00 85 00 dd 09 00 00> - Run Time to Empty [DV] Sec. 31.4 [Battery Measures]: The predicted remaining battery life, in minutes, at the present rate of discharge. The RunTimeToEmpty is calculated based on either current or power depending on the CapacityMode setting
<Buffer d0 00 85 00 01 00 00 00 44 00 85 00 00 00 00 00 45 00 85 00 00 00 00 00 46 00 85 00 01 00 00 00 43 00 85 00 00 00 00 00 42 00 85 00 00 00 00 00>
  - (d0) AC Present [DV] Sec. 31.7 [Charger Status]: Present/Not Present & 
    (44) Charging [Sel] & 
    (45) Discharging [Sel] & 
    (46) Full Charged [Sel] & 
    (43) Remaining Time Limit Expired [Sel] Sec. 31.3.2 [Alarm]: Has expired & 
    (42) Below Remaining Capacity Limit [Sel] Sec. 31.3.2 [Alarm]: Is below

    */
    const schema = {
      hid: [
        {
          reportId: "0x66",
          isEnabled: true,
          usageName: "Remaining Capacity",
          section: "Sec. 31.4 [Battery Measures]",
          desc: "The predicted remaining capacity.",
          valueType: "Int [Percentage]",
          byteLen: 16,
          valuePosition: "4-5"
        },
        {
          reportId: "0x68",
          isEnabled: true,
          usageName: "Run Time to Empty",
          section: "Sec. 31.4 [Battery Measures]",
          desc: "The predicted remaining battery life.",
          valueType: "Int [seconds]",
          byteLen: 8,
          valuePosition: ""
        },
        {
          reportId: "0xd0",
          isEnabled: true,
          usageName: "AC Present",
          section: "Sec. 31.7 [Charger Status]",
          desc: "AC Power Present/Not Present",
          valueType: "Boolean",
          byteLen: 48,
          valuePosition: 4
        },
        {
          reportId: "0x44",
          isEnabled: true,
          usageName: "Charging",
          section: "Sec. 31.7 [Charger Status]",
          desc: "Is battery charging.",
          valueType: "Boolean",
          byteLen: 48,
          bytePosition: 12
        },
        {
          reportId: "0x45",
          isEnabled: true,
          usageName: "Discharging",
          section: "Sec. 31.7 [Charger Status]",
          desc: "Is battery discharging.",
          valueType: "Boolean",
          byteLen: 48,
          valuePosition: 20
        },
        {
          reportId: "0x46",
          isEnabled: true,
          usageName: "Full Charged",
          section: "Sec. 31.7 [Charger Status]",
          desc: "Is battery fully charged.",
          valueType: "Boolean",
          byteLen: 48,
          valuePosition: 28
        },
        //{
        //  reportId: "0x30",
        //  isEnabled: false,
        //  usageName: "",
        //  section: "",
        //  desc: "",
        //  valueType: "",
        //  byteLen: ,
        //  valuePosition: ""
       //}
      ]
    };

    var JSONstringifyRaw = function(arr) {
      var str='<Buffer ';
      for (var i = 0; i < arr.length-1; i++) {
          str += arr[i].toString(16).padStart(2, '0');
          if(i<arr.length-2) { str+=' '; }
      }
      str += '>';
      return str;
    };

    var JSONstringifyHex = function(arr) {
      var str='[';
      for (var i = 0; i < arr.length-1; i++) {
          str += '0x' + arr[i].toString(16).padStart(2, '0');
          if(i<arr.length-2) { str+=', '; }
      }
      str += ']';
      return str;
    };
    
    const bufferAsHex = JSONstringifyHex(buffer);
    const bufferAsStr = JSONstringifyRaw(buffer);
    //const bufferAsStr = buffer.toString('utf-8').trim();
    const reportId = `0x${buffer.readUInt8(0).toString(16).padStart(2, '0')}`;
    const battery = buffer.readUInt16LE(4); // 0x66 
    const time = Math.floor(buffer.readUInt16LE(4) / 60); // 0x68 - Convert to min
    const acPresent = (buffer[4] & 0b00000001) !== 0; // 0xd0
    const charging = (buffer[12] & 0b00000001) !== 0; // 0xd0
    const discharging = (buffer[20] & 0b00000001) !== 0; // 0xd0
    const fullyCharged = (buffer[28] & 0b00000001) !== 0; // 0xd0
  
    return {
      reportId,
      bufferLen: buffer.length,
      bufferRaw: bufferAsStr,
      bufferHex: bufferAsHex,
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
  
  } catch (error) {
    console.error(error.message);
  }
}

main(cannedDataOne);
main(cannedDataTwo);
main(cannedDataThree);
