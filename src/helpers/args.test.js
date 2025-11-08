

describe('helpers/args.js', () => {

  beforeAll(() => { //
  });
  afterAll(() => { //
  });
  beforeEach(() => { //
  });
  afterEach(() => { //
  });

  describe.skip('evalArgs(): Process command line args and generate config object', () => {
    const { evalArgs } = require('./args.js');
    
    test.skip('default options', () => {
      const args = [];
      const devicePath = "/dev/usb/hiddev0";
      const opts = {};
      const result = evalArgs(args, devicePath, opts);
      expect(result).toContain({
        debugEnabled: false,
        prettyEnabled: false,
        onceModeEnabled: false,
        devicePath: "/dev/usb/hiddev0"
      });
    });

    test.skip('enable debug and pretty flags', () => {
      const args = ['--debug', '--pretty'];
      const devicePath = "/dev/usb/hiddev0";
      const opts = {};
      const result = evalArgs(args, devicePath, opts);
      //expect(result).toBeObject();
      /*
      expect(result).toContainAllEntries([
        ['debugEnabled','true'],
        ['prettyEnabled','true'],
        ['onceModeEnabled','false'],
        ['devicePath','/dev/usb/hiddev0']
      ]);
      */
      /*
      expect(result).toEqual({
        debugEnabled: true,
        prettyEnabled: true,
        onceModeEnabled: false,
        devicePath: "/dev/usb/hiddev0"
      });
      */
      expect(result).toContain({
        debugEnabled: true,
        prettyEnabled: true,
        onceModeEnabled: false,
        devicePath: "/dev/usb/hiddev0"
      });
    });

    test.skip('set device path and once mode', () => {
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

    test.skip('set stream mode', () => {
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