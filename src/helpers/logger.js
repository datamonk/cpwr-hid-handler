const winston = require('winston');
const { combine, timestamp, colorize, errors, printf } = winston.format;

const cache = require('../services/cache-service.js');

/**
 * @see https://github.com/winstonjs/winston/blob/master/examples/custom-levels.js
 * 
 * @note ref the below to build a slim logger
 * @see https://github.com/datamonk/carryoptics.io/blob/dev/lib/logger.js
 */

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'grey'
  }
};
/*

async function initLogger() {
  const args = await cache.getArgs('args');
  const ll = args.debugEnabled ? 'debug' : 'info';
  //console.log('loglevel set to:', ll);

  winston.addColors(config.colors);
  return winston.createLogger({
    level: ll || 'info',
    //level: 'trace',
    levels: config.levels,
    format: combine(
      colorize(),
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
    rejectionHandlers: [new winston.transports.File({ filename: 'rejections.log' })]
  });
};

async function startLogger() {
  const logger = await initLogger();
  logger.debug('Logger initialized asynchronously.');
  return logger;
};
*/

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    //this.logger = await initLogger();
    //this.logger = startLogger();
    winston.addColors(config.colors);

    this.logger = winston.createLogger({
      //level: ll || 'info',
      //level: 'trace',
      level: 'debug',
      levels: config.levels,
      format: combine(
        colorize(),
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [new winston.transports.Console()],
      exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
      rejectionHandlers: [new winston.transports.File({ filename: 'rejections.log' })]
    });
    
    Logger.instance = this;
    return this;
  }
  // Expose Winston's logging methods
  info(message) {
    this.logger.info(message);
  }
  warn(message) {
    this.logger.warn(message);
  }
  error(message) {
    this.logger.error(message);
  }
  debug(message) {
    this.logger.debug(message);
  }

  // You can add more methods as needed, or directly expose the logger instance
  getLogger() {
    return this.logger;
  }

}

/** 
 * @note ensure a single instance is exported for the Logger service.
 */
module.exports = new Logger();

//module.exports = {
//  startLogger
//};

/**
 * // In file1.js
const logger = require('./loggerService');

logger.info('This is an informational message from file1.');
logger.error('An error occurred in file1!');

// In file2.js
const logger = require('./loggerService');

logger.warn('A warning from file2.');
logger.debug('Debugging information from file2.');

// You can also access the raw Winston logger if needed
const rawWinstonLogger = logger.getLogger();
rawWinstonLogger.log({
    level: 'verbose',
    message: 'This is a verbose message using the raw Winston logger.'
});
*/