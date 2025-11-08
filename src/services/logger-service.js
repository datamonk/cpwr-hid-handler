const path = require('path');
const winston = require('winston');
const { combine, timestamp, colorize, errors, printf, json } = winston.format;

const cache = require('./cache-service.js');

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

class Logger extends winston.Logger {
  constructor(options = {}, cache = {}, logPaths = {}) {
    // Default paths for .File transports
    const {
      appLogPath = path.join(__dirname, 'app.log'),
      exceptionLogPath = path.join(__dirname, 'exceptions.log'),
      rejectionLogPath = path.join(__dirname, 'rejections.log'),
    } = logPaths;
    const logLevel = options.level || 'info';

    winston.addColors(config.colors);
    const transports = [
      new winston.transports.Console({ // Console transport
        level: logLevel,
        format: combine(
          colorize(),
          errors({ stack: true }),
          //timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          timestamp(), // ISO8601 format
          printf(({ level, message, timestamp }) =>
            `[${timestamp}] ${level}: ${message}`
          )
        ),
      }),
      new winston.transports.File({ // File transport
        filename: appLogPath,
        level: logLevel,
        format: combine(
          timestamp(),
          json()
        ),
      }),
    ];
    
    const exceptionHandlers = [
      new winston.transports.File({ // Exception handler
        maxSize: 500000,
        maxFiles: 2,
        filename: exceptionLogPath
      }),
    ];
    const rejectionHandlers = [
      new winston.transports.File({ // Rejection handler
        maxSize: 500000,
        maxFiles: 2,
        filename: rejectionLogPath
      }),
    ];

    super({ // Initialize Winston Logger with custom opts
      ...options,
      level: logLevel,
      transports,
      exceptionHandlers,
      rejectionHandlers,
      exitOnError: false, // Don't exit on handled exceptions
    });

    this.cache = cache;
    this.defaultLevel = logLevel;
  };

  getCurrentLevel() {
    const debug = this.cache['debug'];
    return debug ? 'debug' : this.defaultLevel;
  };

  log(level, message, ...meta) {
    const currentLevel = this.getCurrentLevel();
    if (currentLevel === 'debug' && level !== 'debug') {
      super.log('debug', `[OVERRIDE:${level}] ${message}`, ...meta);
    } else {
      super.log(level, message, ...meta);
    }
  };

  debug(message, ...meta) { this.log('debug', message, ...meta); }
  info(message, ...meta) { this.log('info', message, ...meta); }
  warn(message, ...meta) { this.log('warn', message, ...meta); }
  error(message, ...meta) { this.log('error', message, ...meta); }

  setDebug(flag) { this.cache['debug'] = !!flag; }
};

module.exports = Logger;

/**
 * @usage
 *   const CustomLogger = require('./CustomLogger');
 *   const logger = new CustomLogger(
 *    { level: 'info' },
 *     {}, // cache
 *     { appLogPath: './logs/app.log', exceptionLogPath: './logs/exceptions.log' } 
 *   );
 *
 *    logger.info("Regular info message.");
 *    logger.setDebug(true);
 *    logger.warn("This will go to debug level due to debug override.");
 *
 *    // Uncaught exceptions or rejected promises will be logged in the exceptions.log file.
 *    process.on('unhandledRejection', err => { throw err; });
*/