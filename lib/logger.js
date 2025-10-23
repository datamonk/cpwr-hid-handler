const col = require('yoctocolors');

class Logger {
  //constructor(debugEnabled = false, verboseEnabled = false) {
  constructor(enabled) {
    //this.debugEnabled = debugEnabled;
    this.enabled = enabled;
  }

  //debug(...messages) {
  //  logDebug(this.debugEnabled, ...messages);
  //}

  verbose(...messages) {
    if (this.enabled) {
      console.log(`[${col.bgGray(`${col.bold('VERBOSE')}`)}]`, ...messages);
    };
  }

  debug(...messages) {
    if (this.enabled) {
      console.log(`[${col.bgGray(`${col.bold('DEBUG')}`)}]`, ...messages);
    };
  }

  /**
  error(...messages) {
    logError(...messages);
  }

  info(...messages) {
    logInfo(...messages);
  }

  warning(...messages) {
    logWarning(...messages);
  }
  */
}
exports.Logger = Logger;

/**
function logDebug(enabled, ...messages) {
  if (enabled) {
    console.log(`[${col.bgGray(`${col.bold('DEBUG')}`)}]`, ...messages);
  };
};
exports.logDebug = logDebug;

function logVerbose(enabled, ...messages) {
  if (enabled) {
    console.log(`[${col.bgBlue(`${col.bold('VERBOSE')}`)}]`, ...messages);
  };
};
exports.logVerbose = logVerbose;

function logError(...messages) {
  console.error(`[${col.bgRed(`${col.bold('ERROR')}`)}]`, ...messages);
};
exports.logError = logError;

function logInfo(...messages) {
  console.log(`[${col.bgGreen(`${col.bold('INFO')}`)}]`, ...messages);
};
exports.logInfo = logInfo;

function logWarning(...messages) {
  console.warn(`[${col.bgYellow(`${col.bold('WARNING')}`)}]`, ...messages);
};
exports.logWarning = logWarning;
*/