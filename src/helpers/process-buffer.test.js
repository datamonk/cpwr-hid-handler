//const logger = require('../../lib/logger.js');

const { parseUsage, splitBufferToChunks }  = require('./process-buffer.js');

// Mock yargs and hideBin
jest.mock('yargs', () => {
  const mYargs = jest.fn(() => ({
    option: jest.fn().mockReturnThis(), // Allow chaining of .option()
    parse: jest.fn(() => ({ verbose: false })), // Default mock return for .parse()
  }));
  return mYargs;
});

jest.mock('yargs/helpers', () => ({
  hideBin: jest.fn((args) => args.slice(2)), // Mock hideBin to return a sliced array
}));

describe('process-buffer', () => {
  beforeAll(() => {
    //const { parseUsage }  = require('./process-buffer.js');
    //const { devicePath } = require('./ups-hid-handler.js');
  });

  afterAll(() => {
    //
  });

  beforeEach(() => {
    //
  });
  
  afterEach(() => {
    //
  });

  describe('splitBufferToChunks(): Split raw buffer event to 8 byte chunks', () => {

    test('should split 16 byte len buffer payload to two 8 byte chunks', () => {
        const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                                 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
        const chunks = splitBufferToChunks(buf, 8);
        
        expect(chunks.length).toBe(2);
        expect(chunks[0]).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
        expect(chunks[1]).toEqual(Buffer.from([0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]));
    });

  });

  describe('parseUsage(): Parse and convert value bytes by Usage ID', () => {

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