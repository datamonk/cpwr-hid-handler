
describe('helpers/etl.js', () => {

  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  test(`should return length match for expected etl.js function exports`, () => {
    const etl = require('./etl.js');
    const len = Object.keys(etl).length;
    expect(len).toBe(4);
  });

  describe('JSONstringifyRaw(): Conversion of buffer in decimal format to raw str', () => {
    const { JSONstringifyRaw } = require('./etl.js');

    test('should convert decimal buffer str', () => {
      const buf = Buffer.from("01 02 03 04 05 06 07 08");
      const result = Buffer.from("<Buffer 01 02 03 04 05 06 07 08 >");
      expect(JSONstringifyRaw(buf)).toEqual(result);
    });
  });

  describe('JSONstringifyHex(): Conversion of buffer in decimal format to hex str', () => {
    const { JSONstringifyHex } = require('./etl.js');
    
    test('should convert decimal buffer array to hex str', () => {
      const buf = Buffer.from("01 02 03 04 05 06 07 08");
      const result = Buffer.from("[0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]");
      expect(JSONstringifyHex(buf)).toEqual(result);
    });
  });

  describe('splitBufferToChunks(): Split raw buffer event to 8 byte chunks', () => {
    const { splitBufferIntoChunks } = require('./etl.js');
    
    test('should split 16 byte len buffer payload to two 8 byte chunks', () => {
      const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                               0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
      const chunks = splitBufferIntoChunks(buf, 8);
      expect(chunks.length).toBe(2);
      expect(chunks[0]).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
      expect(chunks[1]).toEqual(Buffer.from([0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]));
    });

  });

  describe('sortObjectElements(): Sort JSON obj elements based on static key array', () => {
    const { sortObjectElements } = require('./etl.js');

    test('should re-order unsorted object to correct element positions', () => {
      const keyOrder = [
        'ts', 'path', 'batteryPercentage', 'acPresent', 'runTimeToEmpty', 'chargeStatus'
      ];
      const unsortedInput = {
        "path": "/dev/usb/hiddev0",
        "batteryPercentage": 100,
        "ts": 1760837972,
        "acPresent": true,
        "chargeStatus": "fully-charged",
        "runTimeToEmpty": 40
     };
      const sortedOutput = {
          "ts": 1760837972,
          "path": "/dev/usb/hiddev0",
          "batteryPercentage": 100,
          "acPresent": true,
          "runTimeToEmpty": 40,
          "chargeStatus": "fully-charged"
      };
      const result = sortObjectElements(unsortedInput, keyOrder);
      expect(result).toEqual(sortedOutput);
    });
  });

  describe('deriveChargeStatus(): derive battery status from boolean states', () => {
    const { deriveChargeStatus } = require('./etl.js');

    test('should derive "fully-charged" status', () => {
      const result = deriveChargeStatus(true, false, false, true);
      expect(result).toBe('fully-charged');
    });

    test('should derive "charging" status', () => {
      const result = deriveChargeStatus(true, true, false, false);
      expect(result).toBe('charging');
    });

    test('should derive "discharging" status', () => {
      const result = deriveChargeStatus(false, false, true, false);
      expect(result).toBe('discharging');
    });
    
    test('should derive "undefined" status for unknown states', () => {
      const result = deriveChargeStatus(false, false, false, false);
      expect(result).toBe('undefined');
    });
  });

});