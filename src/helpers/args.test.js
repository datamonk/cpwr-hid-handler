const { evalArgs } = require('./args.js');

/*
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
*/

describe('evalArgs(): Process command line arguments for global use.', () => {
  
  //let evalArgs;

  beforeAll(() => {
    //evalArgs = require('./args.js').evalArgs;
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
    
  test('default options', () => {
    
    const args = [];
    const devicePath = "/dev/usb/hiddev0";
    const opts = {};
    const result = evalArgs(args, devicePath, opts);
    
    expect(result).toEqual({
      debugEnabled: false,
      prettyEnabled: false,
      onceModeEnabled: false,
      devicePath: "/dev/usb/hiddev0"
    });
  });
    test('enable debug and pretty flags', () => {
    const args = ['--debug', '--pretty'];
    const devicePath = "/dev/usb/hiddev0";
    const opts = {};
    const result = evalArgs(args, devicePath, opts);
    
    expect(result).toEqual({
      debugEnabled: true,
      prettyEnabled: true,
      onceModeEnabled: false,
      devicePath: "/dev/usb/hiddev0"
    });
  });

  test('set device path and once mode', () => {
    const args = ['--device', '/dev/usb/hiddev1', '--mode', 'once'];
    const devicePath = "/dev/usb/hiddev0";
    const opts = {};
    const result = evalArgs(args, devicePath, opts);
    
    expect(result).toEqual({
      debugEnabled: false,
      prettyEnabled: false,
      onceModeEnabled: true,
      devicePath: "/dev/usb/hiddev1"
    });
  });

  test('set stream mode', () => {
    const args = ['--mode', 'stream'];
    const devicePath = "/dev/usb/hiddev0";
    const opts = {};
    const result = evalArgs(args, devicePath, opts);
    
    expect(result).toEqual({
      debugEnabled: false,
      prettyEnabled: false,
      onceModeEnabled: false,
      devicePath: "/dev/usb/hiddev0"
    });
  });

});