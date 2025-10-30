const winston = require('winston');
//const { combine, timestamp, colorize, errors, printf } = winston.format;

const { CacheService } = require('../services/cache-service.js');
const cache = new CacheService();

let logLevel

(async function setLogLevel() {
  let args = await cache.getArgs('args');
  //let args = cache.getArgs('args');
  const isDebug = args.debugEnabled;
  logLevel = isDebug ? 'debug' : 'info'; 
  console.log('Log Level is:', logLevel);
  console.log('debug bool is:', args.debugEnabled);
})();

/**
 * @see https://github.com/winstonjs/winston/blob/master/examples/custom-levels.js
 */

/**
 * The SyntaxError: Unexpected token '||=' in Node.js indicates that the
 * version of Node.js being used does not support the logical OR assignment 
 * operator (||=). This operator, along with logical AND assignment (&&=) 
 * and nullish coalescing assignment (??=), was introduced in ECMAScript 2021 
 * (ES2021).
 */

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  //levels: logLevels,
  //level: logLevel || 'info',
  level: 'info',
  //format: combine(
  //  colorize(),
  //  errors({ stack: true }),
  //  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  //  printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  //),
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = {
  logger
};

/*
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
*/

//logger.info('This is an info message');
//logger.warn('This is a warning message');
//logger.debug('This is a debug message');
//logger.error('This is an error message');

/**
  const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});
 */

/**
 * npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
 * npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory.
 *      Do not use it. Check out lru-cache if you want a good and tested way to coalesce
 *      async requests by a key value, which is much more comprehensive and powerful.
 */

//const isDebugMode = argv.debug || false; // Default to false if not provided

// @ref https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/



/** const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});
*/
/**
const logger = winston.createLogger({
  levels: logLevels,
  level: isDebugMode ? 'debug' : 'info', // Set level to 'debug' if in debug mode, else 'info'
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
*/
/**
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});
*/
/**
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), cli()),
  transports: [new winston.transports.Console()],
});
*/
/**
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
*/