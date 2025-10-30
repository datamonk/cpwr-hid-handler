const logger = require('./logger.js');

(async function loggerTest() {
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.debug('This is a debug message');
  logger.error('This is an error message');
})();