
describe('services/process-buffer.js', () => {
  
  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe('parseUsage(): Parse and convert value bytes by Usage ID', () => {
    const { parseUsage }  = require('./process-buffer.js');

    test('should ignore short/malformed buffer for any Usage ID', () => {
      const id = '0x66';
      const buf = Buffer.from([0x66, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // only 7 bytes
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toBeUndefined();
    });

    test('should parse 0x66 and return converted value of 100', () => {
      const id = '0x66';
      const buf = Buffer.from([0x66, 0x00, 0x85, 0x00, 0x64, 0x00, 0x00, 0x00]); // 100%
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ batteryPercentage: 100 });
    });

    test('should parse 0x68 and return converted value of 30 (min)', () => {
      const id = '0x68';
      const buf = Buffer.from([0x68, 0x00, 0x85, 0x00, 0xB4, 0x01, 0x00, 0x00]); // 436 sec = 7.26 min -> 7 min
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ runTimeToEmpty: 7 });
    });

    test('should parse 0xd0 and return acPresent true', () => {
      const id = '0xd0';
      const buf = Buffer.from([0xD0, 0x00, 0x85, 0x00, 0x01, 0x00, 0x00, 0x00]);
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ acPresent: true });
    });

    test('should parse 0x44 and return charging true', () => {
      const id = '0x44';
      const buf = Buffer.from([0x44, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]);
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ charging: true });
    });

    test('should parse 0x45 and return discharging false', () => {
      const id = '0x45';
      const buf = Buffer.from([0x45, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ discharging: false });
    });

    test('should parse 0x46 and return fullyCharged true', () => {
      const id = '0x46';
      const buf = Buffer.from([0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]);
      let output = {};
      const result = parseUsage(id, buf, output);
      expect(result).toEqual({ fullyCharged: true });
    });

    test('should throw (new Error) for unrecognized Usage ID', () => {
      const id = '0x99'; // Unrecognized ID
      const buf = Buffer.from([0x99, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      let output = {};
      expect(() => parseUsage(id, buf, output)).toThrow(`Unknown Usage ID: ${id}`);
    });

  });

});