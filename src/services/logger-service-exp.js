const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.logger = winston.createLogger({
            level: 'info', // Default logging level
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                align(),
                printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
                // Add other transports here, e.g., file transport
                // new winston.transports.File({ filename: 'app.log' })
            ]
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

module.exports = new Logger(); // Export a single instance

/**
 // In file1.js
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