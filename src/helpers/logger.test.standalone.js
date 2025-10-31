const processArgs = require('./args.js');
const { startLogger } = require('./logger.js');

const args = ['--debug', '--pretty'];
//const args = [];
//const args = process.argv.slice(2);

const devicePath = "/dev/usb/hiddev0";
const opts = {};

//console.log('process args are:', args);

async function main() {
  await getArgsFromCache();
  const logger = await startLogger();
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.debug('This is a debug message');
  logger.trace('This is an trace message');
  logger.error('This is an error message');
};

async function getArgsFromCache() {
  processArgs.evalArgs(args, devicePath, opts);
};

main();