const _ = require('lodash');

// Mock yargs and hideBin
jest.mock('yargs', () => {
  const mYargs = jest.fn(() => ({
    option: jest.fn().mockReturnThis(), // Allow chaining of .option()
    parse: jest.fn(() => ({ verbose: false })), // Default mock return for .parse()
  }));
  return mYargs;
});

jest.mock('yargs/helpers', () => ({
  hideBin: jest.fn((args) => args.slice(2)), // Mock hideBin to return a sliced array
}));

describe('log levels', () => {
  let consoleSpy;
  let logger;

  beforeAll(() => {
    logger = require('./logger.js'); // Import logger after mocking yargs
  });

  beforeEach(() => {
    /**
     * @note The common `spyOn(console, 'log')` method does not work with
     *       atleast the winston logger in conjuction with Jest. Apperently
     *       this is due to the custom Console Implementation as mentioned
     *       in: @see https://github.com/jestjs/jest/issues/9984 
     */
    consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});

    // Clear all instances and calls to constructor and all methods:
    //consoleSpy.mockClear();
    //process.argv = ['node', 'logger.js', '--debug'];
    //jest.resetModules();
    // Clear mocks before each test to ensure isolation
    //jest.clearAllMocks();

    // Spy on console.log before each test
    //consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    //consoleSpy = jest.spyOn(console, 'log');
    /*
    logger = winston.createLogger({
      level: 'info', // Set the log level dynamically
      format: combine(
      //colorize(),
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      //format: winston.format.simple(),
      transports: [
        new winston.transports.Console()
      ],
    });
    */
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  test('should log info messages to console', () => {
    //logger.info('This is an info message');
    //const result = logger.info('This is an info message');
    //expect(consoleSpy).toHaveBeenCalled();
    //expect(result).toHaveBeenCalledWith(expect.stringContaining(result));
    //logger.debug(result);

    //console.log('Testing console log');
    logger.info('This is an info message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('info: This is an info message'));
    
    
  });

  test('should log warn messages to console', () => {
    logger.warn('This is a warning message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('warn: This is a warning message'));
  });

  test('should not log debug messages if level is info', () => {
    logger.debug('This is a debug message');
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('debug: This is a debug message'));
  });

  test('should log error messages to console', () => {
    logger.error('This is an error message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error: This is an error message'));
  });

  /*
  describe('Log Levels', function () {
    const logLevels = {
      //'0': 'fatal',
      '1': 'error',
      '2': 'warn',
      '3': 'info',
      //'4': 'debug',
      //'5': 'trace',
    };
    const llarr = _.values(logLevels);

    const message = 'Test log message';
    //const loggedMessage = `2024-06-15 12:00:00 ${level}: ${message}`;

    //it.each(logLevels, (levelNum, level) => {
      test.each(llarr)('should log a message with the correct format for level: %s', (level) => {
      //it(`should log a message with the correct format for level: ${level}`, () => {
        let loggerMethod = logger[level];
        // Mock the console method corresponding to the log level
        const consoleSpy = jest.spyOn(console, level).mockImplementation(() => {});

        loggerMethod(message);

        // Assertions for the spy
        expect(consoleSpy).toHaveBeenCalled();
        // Verify that the console method was called exactly once
        expect(consoleSpy).toHaveBeenCalledTimes(1);

        //const loggedMessage = consoleSpy.mock.calls[0][0];
        const loggedMessage = consoleSpy.mock.calls[0][0];
        // Verify that the console method was called with the expected formatted message
        expect(loggedMessage).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2} ${level}: ${message}`));

        consoleSpy.mockRestore();
      });
      
    //});
  
  //const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  //let consoleSpy;



  //afterEach(() => {
  //  consoleSpy.mockRestore();
  //});

  //it.skip('should have all log level methods', () => {
  //  llarr.forEach((level) => {
  //    expect(typeof logger[level]).toBe('function');
  //  });
  //});

  //describe('log message format', () => {
  //test.each(llarr)('should log a message with the correct format for level: %s', (level) => {
    //consoleSpy = jest.spyOn(console, level).mockImplementation(() => {});

    //const message = `${level} message`;
    //logger[level](message);

    // Assertions for the spy
    //expect(consoleSpy).toHaveBeenCalled();
    // Verify that the console method was called exactly once
    //expect(consoleSpy).toHaveBeenCalledTimes(1);

    //const loggedMessage = consoleSpy.mock.calls[0][0];
    // Verify that the console method was called with the expected formatted message
    //expect(loggedMessage).toMatch(new RegExp(`\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2} ${level}: ${message}`));
    
    //const expectedOutput = `[${level.toUpperCase()}]: ${message}`;
    //expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);

    //consoleSpy.mockRestore();

    });
    */
    //mockExit.mockRestore(); // Restore original process.exit
  //});
});

/*
logger.silly('silly message');
logger.debug('debug message, only shown with --debug flag.');
logger.verbose('verbose message');
logger.info('info message.');
logger.warn('warning message.');
logger.error('error message.');
//logger.error(new Error("throw error"));

function somethingSuperCool() {
  logger.debug('Executing a function that generates a debug log.');
};
somethingSuperCool();
*/
// 
/* Expected output without --debug flag:
 * $ node lib/logger.test.js 
 * --------------------------------
 * 2025-10-23 22:11:42 info: info message.
 * 2025-10-23 22:11:42 warn: warning message.
 * 2025-10-23 22:11:42 error: error message.
 * --------------------------------
 * 
 * Expected output with --debug flag:
 * $ node lib/logger.test.js --debug
 * --------------------------------
 * 2025-10-23 22:11:24 debug: debug message, only shown with --debug flag.
 * 2025-10-23 22:11:24 info: info message.
 * 2025-10-23 22:11:24 warn: warning message.
 * 2025-10-23 22:11:24 error: error message.
 * 2025-10-23 22:11:24 debug: Executing a function that generates a debug log.
 * --------------------------------
 */

/*
// start a timer
const profiler = logger.startTimer();
setTimeout(() => {
  profiler.done({ message: 'Logging message' });
  //profiler.done({ message: 'Logging message', level: 'debug' });
}, 1000);
*/

