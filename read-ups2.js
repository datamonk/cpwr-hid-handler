
const Logger = require('./lib/logger.js');
const { evalArgs } = require('./lib/args.js');
const UpsHidHandler = require('./src/ups-handler.js');

const vendorId = 0x0764;
const productId = 0x0501;
var devicePath = "/dev/usb/hiddev0"; // Default path if not overridden with opt.

let args = {};
evalArgs(process.argv.slice(2), devicePath, args);
const opts = Object.entries(args);

const logger = new Logger(opts.debugEnabled); // Default boolean to enable debug logs

let handler = null;
handler = new UpsHidHandler(vendorId, productId, opts.devicePath);

handler.connect(); // Connect to the UPS and kickoff read-cycle

// Handle graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    logger.debug('Caught interrupt signal (SIGINT). Closing device and exiting...');
    handler.disconnect();
    process.exit();
});

