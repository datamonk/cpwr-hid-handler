// my-cli-tool.js
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export function runCli(args) {
  return yargs(hideBin(args))
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .parse();
}