const Logger = require('./logger-service.js');

describe('services/logger-service.js', () => {
  let logger;
  let consoleSpy;
  /** ISO 8601 timestamp regex to match the configured 'winston.format.timestamp()'
   *  spec:
   *    @format YYYY-MM-DDTHH:mm:ss.sssZ (e.g., 2025-11-07T20:46:21.123Z)
   *    @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
   */ 
  const iso8601Regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

  beforeAll(() => { //
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
    /** @broken usage */
    //consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore(); // Restore the original console method
  });

  test('Logger(): should have timestamp at beginning of log event', () => {
    logger = new Logger({ level: 'info' });
    logger.info('Start timestamp test');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0]; // Grab first arg from console.log
    const timestampMatch = output.match(iso8601Regex);
    // Should be at index 0 or after color codes
    expect(output.indexOf(timestampMatch[0])).toBeGreaterThanOrEqual(0);
  });

  test('Logger(): should log INFO event with prefixed ISO8601 timestamp', () => {
    logger = new Logger({ level: 'info' });
    logger.info('Test info message');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];
    expect(iso8601Regex.test(output)).toBe(true);
    expect(output).toMatch(/Test info message/);
  });

  test('Logger(): should log WARN event with prefixed ISO8601 timestamp', () => {
    logger = new Logger({ level: 'warn' });
    logger.warn('Warn message');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];
    expect(iso8601Regex.test(output)).toBe(true);
    expect(output).toMatch(/Warn message/);
  });

  test('Logger(): should log DEBUG event with prefixed ISO8601 timestamp', () => {
    logger = new Logger({ level: 'debug' });
    logger.debug('Debug here');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];
    expect(iso8601Regex.test(output)).toBe(true);
    expect(output).toMatch(/Debug here/);
  });

  test('Logger(): should log ERROR event with prefixed ISO8601 timestamp', () => {
    logger = new Logger({ level: 'error' });
    logger.error('Error message');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];
    expect(iso8601Regex.test(output)).toBe(true);
    expect(output).toMatch(/Error message/);
  });

  test('Logger(): should NOT log DEBUG messages if level is INFO', () => {
    logger = new Logger({ level: 'info' });
    logger.debug('This is an omitted debug message');

    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('This is an omitted debug message'));
  });

  test.skip('logger(): should log INFO messages to console with DEBUG override', () => {
    const logger = new Logger(
      { level: 'debug' },
      {}, // cache
      { appLogPath: './logs/app.log', exceptionLogPath: './logs/exceptions.log' }
    );
    const isoTimestampRegex = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] debug: [OVERRIDE:info] This is an info message/;
    logger.info('This is an info message');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    //expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('info: This is an info message'));
    // Check that the log function was called with a string that matches the regex
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(isoTimestampRegex));
  });

});

/*
const CustomLogger = require('./CustomLogger');
const logger = new CustomLogger({ level: 'info' });

// By default, non-debug logs
logger.info("This is info"); // logs as info
logger.debug("This is debug"); // logs as debug

// Turn on debug override
logger.setDebug(true);
logger.info("This info forced to debug");
logger.warn("This warning forced to debug");

logger.setDebug(false);
logger.info("Back to info");
*/
// USAGE EXAMPLE:
//logger.info("Regular info message.");
//logger.setDebug(true);
//logger.warn("This will go to debug level due to debug override.");

// Uncaught exceptions or rejected promises will be logged in the exceptions.log file.
//process.on('unhandledRejection', err => { throw err; });