//const { evalArgs } = require('./args.js');

describe('helpers/args.js', () => {

  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe('evalArgs(): Process command line args and generate config object', () => {
    const { evalArgs } = require('./args.js');
    
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

});