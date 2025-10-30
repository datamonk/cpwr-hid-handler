const fs = require('fs');
const path = require('path');

const { writeArgsFile } = require(path.join(__dirname, '../services/args-file-service.js'));
const configPath = path.join(__dirname, '../config/.runtime-args.json');

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
  let debugEnabled = false;
  let prettyEnabled = false;
  let onceModeEnabled;

  //const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--debug' || args[i] === '-d') {
      debugEnabled = true;
      //logger.debug('Verbose mode enabled.');
    } else if (args[i] === '--pretty' || args[i] === '-p') {
      prettyEnabled = true;
      //logger.debug('Pretty print enabled.');
    } else if (args[i] === '--device' || args[i] === '-d') {
      if (i + 1 < args.length) {
        devicePath = args[i + 1].toLowerCase();
        //logger.debug('Device path set to:', devicePath);
      } else {
        console.error('No device path provided after --device or -d flag.');
        process.exit(1);
      };
    } else if (args[i] === '--mode' || args[i] === '-m') {
      if (i + 1 < args.length) {
        const mode = args[i + 1].toLowerCase();
        onceModeEnabled = true; // default to once
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

  opts = {
    debugEnabled: debugEnabled,
    prettyEnabled: prettyEnabled,
    onceModeEnabled: onceModeEnabled,
    devicePath: devicePath
  };

  if (opts.debugEnabled) {
    console.log('Parsed options:', opts);
    //logger.debug('Parsed options:', opts);
  }

  //writeArgsFile(configPath, opts);
  
  
  //fs.readFileSync(configPath, 'utf8', (err, data) => {
  //  if (err) {
  //    console.error(err);
  //    return;
  //  }
  //  console.log('File contents:', data);
  //});

  return;
};

module.exports = {
    evalArgs
};