
// lib/args.js

const Logger = require('./lib/logger.js');
const logger = new Logger(false); // Default boolean to enable debug logs

// export let verboseEnabled = true|false;

//let devicePath = "/dev/usb/hiddev0"; // Default path if not overridden with opt.

/**
 * @desc Parse command-line arguments to extract UPS device path if provided.
 * @param {string[]} args - The array of command-line arguments.
 * @param {boolean} debugEnabled - Flag to enable debug logging.
 * @param {boolean} prettyEnabled - Flag to enable pretty print output.
 * @param {boolean} onceModeEnabled - Flag to set once mode (true) or stream mode (false).
 * @param {string} devicePath - The path to the UPS device.
 * @param {object} opts - The empty object to store parsed arguments.
 * @returns {object} The object containing parsed arguments.
 */
function evalArgs(args, devicePath, opts) {
  //const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
  if (args[i] === '--debug' || args[i] === '-d') {
    var debugEnabled = true;
    logger.debug('Verbose mode enabled.');
  } else if (args[i] === '--pretty' || args[i] === '-p') {
    var prettyEnabled = true;
    logger.debug('Pretty print enabled.');
  } else if (args[i] === '--device' || args[i] === '-d') {
    if (i + 1 < args.length) {
      devicePath = args[i + 1].toLowerCase();
      logger.debug('Device path set to:', devicePath);
    } else {
      console.error('No device path provided after --device or -d flag.');
      process.exit(1);
    };
  } else if (args[i] === '--mode' || args[i] === '-m') {
    if (i + 1 < args.length) {
      const mode = args[i + 1].toLowerCase();
      var onceModeEnabled = true; // default to once
      if (mode === 'once') {
        // noop since default is already true
      } else if (mode === 'stream') {
        onceModeEnabled = false;
      } else {
        console.error('Invalid mode. Use "once" or "stream".');
        process.exit(1);
      };
    } else {
      console.error('No mode provided after --mode or -m flag.');
      process.exit(1);
    };
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log('Usage: node read-ups.js [--mode <once|stream>] [--device </path/to/dev>] [--verbose] [--pretty]');
    process.exit(0);
  };
};

  opts.debugEnabled = debugEnabled || false;
  opts.prettyEnabled = prettyEnabled || false;
  opts.onceModeEnabled = onceModeEnabled || false;
  opts.devicePath = devicePath || "/dev/usb/hiddev0";
  
  return opts;
}

module.exports = {
    evalArgs
};