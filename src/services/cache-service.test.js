const { CacheService } = require('./cache-service.js');
const cache = new CacheService();

(async function configTest() {
    let confUno = await cache.readConfig('config', 5000);
    console.log('config object [set from file; cache miss]:', confUno);

    let confDos = await cache.readConfig('config', 5000);
    console.log('config object [get; cache hit]:', confDos);

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

  let newArgs = await cache.setArgs('args', cannedArgs, 5000);
  console.log('args object [set; cache null]:', newArgs);

  let getArgs = await cache.readArgs('args');
  console.log('args object [get; cache hit]:', getArgs);
  
  /**
   * @output
   * {
   * debugEnabled: true,
   * prettyEnabled: false,
   * onceModeEnabled: false,
   * devicePath: '/dev/usb/hiddev0'
   * }
   */

  console.log('parsed debug boolean:', getArgs.debugEnabled);
  // parsed debug boolean: true
  
  })();