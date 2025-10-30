// app.js
require('dotenv').config(); // Load .env file variables
const winston = require('winston');

// 1. Get log level from command-line argument
// e.g., `node app.js --log-level=debug`
const argLogLevel = process.argv.find(arg => arg.startsWith('--log-level='))?.split('=')[1];

// 2. Use command-line argument, fallback to .env, then default to 'info'
const logLevel = argLogLevel || process.env.LOG_LEVEL || 'info';

// 3. Create the Winston logger with the determined log level
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

// 4. Test the logger
logger.error('This is an error log.');
logger.warn('This is a warning log.');
logger.info('This is an info log.');
logger.debug('This is a debug log.');
logger.silly('This is a silly log.');