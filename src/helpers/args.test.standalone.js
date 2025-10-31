const processArgs = require('./args.js');

//const args = ['--debug', '--pretty'];
const args = process.argv.slice(2);
const devicePath = "/dev/usb/hiddev0";
const opts = {};

console.log('process args are:', args);

processArgs.evalArgs(args, devicePath, opts);