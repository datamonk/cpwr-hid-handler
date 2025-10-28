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

  describe.skip('JSONstringifyRaw(): todo', () => {
    const { JSONstringifyRaw } = require('./etl.js');

    test.skip('placeholder test', () => {
      expect(true).toBe(true);
    });
  });

  describe.skip('JSONstringifyHex(): todo', () => {
    const { JSONstringifyHex } = require('./etl.js');

    test.skip('placeholder test', () => {
      expect(true).toBe(true);
    });
  });

  describe.skip('splitBufferIntoChunks(): todo', () => {
    const { splitBufferIntoChunks } = require('./etl.js');

    test.skip('placeholder test', () => {
      expect(true).toBe(true);
    });
  });

  describe.skip('sortObjectElements(): todo', () => {
    const { sortObjectElements } = require('./etl.js');

    test.skip('placeholder test', () => {
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