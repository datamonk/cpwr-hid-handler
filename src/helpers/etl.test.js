//const etl = require('./etl.js');

describe('helpers/etl.js', () => {

  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe.todo('JSONstringifyRaw(): todo', () => {
    const { JSONstringifyRaw } = require('./etl.js');

    test.todo('placeholder test', () => {
      expect(true).toBe(true);
    });
  });

  describe.todo('JSONstringifyHex(): todo', () => {
    const { JSONstringifyHex } = require('./etl.js');

    test.todo('placeholder test', () => {
      expect(true).toBe(true);
    });
  });

  describe.todo('splitBufferIntoChunks(): todo', () => {
    const { splitBufferIntoChunks } = require('./etl.js');

    test.todo('placeholder test', () => {
      expect(true).toBe(true);
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

  describe.todo('sortObjectElements(): todo', () => {
    const { sortObjectElements } = require('./etl.js');

    test.todo('placeholder test', () => {
      expect(true).toBe(true);
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