
// Persistent default config that is cached at runtime.
const appConfig = {
  vendorId: 0x0764,
  productId: 0x0501,
  devicePath: "/dev/usb/hiddev0",
  defaultLogLevel: "info",
  keyOrder: [
    'ts',
    'path',
    'batteryPercentage',
    'acPresent',
    'runTimeToEmpty',
    'chargeStatus'
  ],
  usagesToParse: [
    '0x66',
    '0x68',
    '0xd0',
    '0x44',
    '0x45',
    '0x46'
  ]
};

module.exports = {
  appConfig
};