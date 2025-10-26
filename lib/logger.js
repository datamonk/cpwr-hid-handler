const winston = require('winston');
const { combine, timestamp, colorize, errors, printf } = winston.format;

//import yargs from 'yargs';
//import { hideBin } from 'yargs/helpers';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
//const yargs = require('yargs');
//const { hideBin } = require('yargs/helpers');
//import yargs from 'yargs';
//import { hideBin } from 'yargs/helpers';

//const _ = require('lodash');

// Define custom log levels
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

// Use yargs to parse the command-line arguments
// `hideBin` removes the first two elements ('node' and the script path) from process.argv
/*
const argv = yargs(hideBin(process.argv))
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    description: 'Enable debug logging',
  })
  .argv;
*/
const argv = yargs(hideBin(process.argv))
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    description: 'Enable debug logging',
  })
  .parse();
  //.argv;
// Determine the log level based on the command-line flag
const logLevel = argv.debug ? 'debug' : 'info';

const logger = winston.createLogger({
  levels: logLevels,
  level: logLevel, // Set the log level dynamically
  format: combine(
  //  colorize(),
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  //format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;

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