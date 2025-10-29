const logger = require('./logger.js');

//const _ = require('lodash');

describe('helpers/logger.js', () => {
  let consoleSpy;

  beforeAll(() => {
  });
  afterAll(() => { //
  });
  beforeEach(() => {
    /**
     * @note The common `spyOn(console, 'log')` method does not work with
     *       at least the winston logger in conjunction with Jest. Apparently
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
  
  test('logger(): should log info messages to console', () => {
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

  test('logger(): should log warn messages to console', () => {
    logger.warn('This is a warning message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('warn: This is a warning message'));
  });

  test('logger(): should not log debug messages if level is info', () => {
    logger.debug('This is a debug message');
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('debug: This is a debug message'));
  });

  test('logger(): should log error messages to console', () => {
    logger.error('This is an error message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error: This is an error message'));
  });

});

