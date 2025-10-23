//import winston from 'winston';
//const { combine, timestamp, cli } = winston.format;
//const { combine, timestamp, printf, colorize, align } = winston.format;

//const { combine, timestamp, json } = winston.format;
//const col = require('yoctocolors');

const winston = require('winston');

// @ref https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

/** const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});
*/

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

/**
class Logger {
  //constructor(debugEnabled = false, verboseEnabled = false) {
  constructor(enabled) {
    //this.debugEnabled = debugEnabled;
    this.enabled = enabled;
  }

  //debug(...messages) {
  //  logDebug(this.debugEnabled, ...messages);
  //}

  verbose(...messages) {
    if (this.enabled) {
      console.log(`[${col.bgGray(`${col.bold('VERBOSE')}`)}]`, ...messages);
    };
  }

  debug(...messages) {
    if (this.enabled) {
      console.log(`[${col.bgGray(`${col.bold('DEBUG')}`)}]`, ...messages);
    };
  }

  /**
  error(...messages) {
    logError(...messages);
  }

  info(...messages) {
    logInfo(...messages);
  }

  warning(...messages) {
    logWarning(...messages);
  }
  
}
exports.Logger = Logger;

*/

/**
function logDebug(enabled, ...messages) {
  if (enabled) {
    console.log(`[${col.bgGray(`${col.bold('DEBUG')}`)}]`, ...messages);
  };
};
exports.logDebug = logDebug;

function logVerbose(enabled, ...messages) {
  if (enabled) {
    console.log(`[${col.bgBlue(`${col.bold('VERBOSE')}`)}]`, ...messages);
  };
};
exports.logVerbose = logVerbose;

function logError(...messages) {
  console.error(`[${col.bgRed(`${col.bold('ERROR')}`)}]`, ...messages);
};
exports.logError = logError;

function logInfo(...messages) {
  console.log(`[${col.bgGreen(`${col.bold('INFO')}`)}]`, ...messages);
};
exports.logInfo = logInfo;

function logWarning(...messages) {
  console.warn(`[${col.bgYellow(`${col.bold('WARNING')}`)}]`, ...messages);
};
exports.logWarning = logWarning;
*/