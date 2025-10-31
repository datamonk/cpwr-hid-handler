const winston = require('winston');
const { combine, timestamp, colorize, errors, printf } = winston.format;

const cache = require('../services/cache-service.js');

/**
 * @see https://github.com/winstonjs/winston/blob/master/examples/custom-levels.js
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

module.exports = {
  startLogger
};