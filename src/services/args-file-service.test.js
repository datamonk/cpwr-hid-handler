//const path = require('path');
//const filePath = path.join(__dirname, '../config/.runtime-args.json');

describe('services/args-file-service.js', () => {
  
  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe('writeArgsFile(): Write and cleanup runtime config file from arg payload', () => {
    const { writeArgsFile } = require('./args-file-service.js');
    const fs = require('fs'); // should pickup `__mocks__/fs.js` module

    beforeAll(() => { //
    });
    afterAll(() => { //
    });
    beforeEach(() => {
      // Clear mock calls and reset mockFiles before each test
      fs.writeFileSync.mockClear();
      fs.readFileSync.mockClear();
      fs.existsSync.mockClear();
      fs.unlinkSync.mockClear();
      // Reset the internal state of the mock fs if necessary
      // (e.g., if you're tracking files created)
    });
    afterEach(() => { //
    });

    test('should write and read a JSON config file correctly', () => {
      //const testData = { key: 'value', number: 123 };
      const optsData = {
        debugEnabled: false,
        prettyEnabled: false,
        onceModeEnabled: false,
        devicePath: "/dev/usb/hiddev0"
      };
      const filePath = '/mock/path/test.json';
      const result = writeArgsFile(filePath, opts);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(optsData));
      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
      expect(result).toEqual(optsData);
    });

    test('should handle non-existent config during read', () => {
      const filePath = '/mock/path/non-existent.json';
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('File not found');
      });
      expect(() => writeArgsFile(filePath, { some: 'data' })).toThrow('File not found');
    });

    test.todo('should delete the config successfully on process exit', () => {
      fs.unlinkSync.mockImplementation(() => {});
      const filePath = '/mock/path/file.json';
      const result = writeArgsFile(filePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
      expect(result).toBe('File deleted successfully');
    });
  
    test.todo('should handle errors during config deletion on process exit', () => {
      const errorMessage = 'Permission denied';
      fs.unlinkSync.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const filePath = '/mock/path/another-file.json';
      const result = writeArgsFile(filePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
      expect(result).toBe(`Error deleting file: ${errorMessage}`);
    });
  });

});