//import logger from './logger.js';
const logger = require('./logger.js');

// @ref tests: https://github.com/winstonjs/winston/blob/master/test/unit/winston/logger.test.js#L79

logger.info('Info message');
logger.warn('Warning message');
logger.fatal('fatal!');
logger.debug('debug!');
logger.trace('trace!');
logger.error('Error message');
logger.error(new Error("an error"));

// start a timer
const profiler = logger.startTimer();
setTimeout(() => {
  // End the timer and log the duration
  //profiler.done({ message: 'Logging message' });
  profiler.done({ message: 'Logging message', level: 'debug' });
}, 1000);


const args = process.argv.slice(2); // Get arguments after 'node' and script name
const isDebugMode = args.includes('--debug') || args.includes('-d');

// node logger.test.js --debug

// const Logger = require('./lib/logger.js');
// const logger = new Logger(false); // Default boolean to enable debug logs