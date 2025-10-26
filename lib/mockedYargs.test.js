// my-cli-tool.test.js
import { runCli } from './mockedYargs.js';

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

describe('my-cli-tool', () => {
  beforeEach(() => {
    // Clear mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  test('should call yargs and hideBin with correct arguments', () => {
    const mockArgs = ['node', 'cli.js', '--verbose'];
    runCli(mockArgs);

    // Verify yargs was called
    expect(require('yargs')).toHaveBeenCalledTimes(1);

    // Verify hideBin was called with the correct arguments
    expect(require('yargs/helpers').hideBin).toHaveBeenCalledTimes(1);
    expect(require('yargs/helpers').hideBin).toHaveBeenCalledWith(mockArgs);

    // Verify yargs was called with the result of hideBin
    expect(require('yargs')).toHaveBeenCalledWith(['--verbose']);
  });

  test('should parse options correctly', () => {
    const mockArgs = ['node', 'cli.js', '-v'];
    const parsedArgs = runCli(mockArgs);

    // Verify the parsed arguments from the mock
    expect(parsedArgs).toEqual({ verbose: false }); // Based on the default mock return
  });
});