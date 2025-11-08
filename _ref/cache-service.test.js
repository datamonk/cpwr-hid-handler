const cache = require('./cache-service.js');

(async function configTest() {
    let readConfigUno = await cache.getConfig('config', 5000);
    console.log('config object [set from file; cache miss]:', readConfigUno);

    let readConfigDos = await cache.getConfig('config', 5000);
    console.log('config object [get; cache hit]:', readConfigDos);

    /**
     * @output
     * {
     * vendorId: '0x0764',
     * productId: '0x0501',
     * devicePath: '/dev/usb/hiddev0',
     * defaultLogLevel: 'info',
     * keyOrder: [
     *  'ts',
     *  'path',
     *  'batteryPercentage',
     *  'acPresent',
     *  'runTimeToEmpty',
     *  'chargeStatus'
     * ],
     * usagesToParse: [ '0x66', '0x68', '0xd0', '0x44', '0x45', '0x46' ]
     * }
    */
})();

(async function argsTest() {
  const cannedArgs = {
    debugEnabled: true,
    prettyEnabled: false,
    onceModeEnabled: false,
    devicePath: "/dev/usb/hiddev0"
  };

  let writeArgs = await cache.setArgs('args', cannedArgs, 5000);
  console.log('args object [set; cache null]:', writeArgs);

  let readArgs = await cache.getArgs('args');
  console.log('args object [get; cache hit]:', readArgs);
  
  /**
   * @output
   * {
   * debugEnabled: true,
   * prettyEnabled: false,
   * onceModeEnabled: false,
   * devicePath: '/dev/usb/hiddev0'
   * }
   */

  console.log('parsed debug boolean:', readArgs.debugEnabled);
  // parsed debug boolean: true

  })();