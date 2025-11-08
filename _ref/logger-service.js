//'use strict';

// Modules
const _ = require('lodash');
const dayjs = require('dayjs');
const mkdirp = require('mkdirp');
const path = require('path');
const serialize = require('winston/lib/winston/common').serialize;
const util = require('util');
const winston = require('winston');

const config = require(__dirname + '/../config/config.js');

// Constants
const logLevels = {
  '0': 'error',
  '1': 'warn',
  '2': 'info',
  '3': 'verbose',
  '4': 'debug',
  '5': 'silly',
};
const logColors = {
  error: 'bgRed',
  warn: 'bgYellow',
  info: 'bold',
  verbose: 'gray',
  debug: 'dim',
  //debug: 'green',
  silly: 'blue',
  timestamp: 'magenta',
  carryoptics: 'cyan',
  app: 'green',
};
const userLevels = ['warn', 'error'];

// Maxsize
let fcw = 0;

// Rewriters
const keySanitizer = sanitizeKey => (level, msg, meta) => {
  _.forEach(meta, (value, key) => {
    if (sanitizeKey === key) meta[key] = '****';
  });
  return meta;
};

module.exports = class Log extends winston.Logger {

  // using global configuration
  constructor({logDir, logLevelConsole = config.logLevelConsole, logLevel = config.logLevel, logName = config.logName, componentName = 'none'} = {}) {
  // static
  //constructor({logDir, logLevelConsole = 'warn', logLevel = 'debug', logName = 'carryoptics', componentName = 'none'} = {}) {

  // If loglevelconsole is numeric lets map it!
  if (_.isInteger(logLevelConsole)) logLevelConsole = logLevels[logLevelConsole];

  // The default console transport
  const transports = [
    new winston.transports.Console({
      timestamp: () => dayjs().format('HH:mm:ss'),
      //formatter: options => {
      format: options => {
        // Get da prefixes
        const element = (logName === 'carryoptics') ? 'carryoptics' : logName;
        const elementColor = (logName === 'carryoptics') ? 'carryoptics' : 'app';
        // Set the leftmost colum width
        fcw = _.max([fcw, _.size(element)]);
        // Default output
        const output = [
          winston.config.colorize(elementColor, _.padEnd(element.toLowerCase(), fcw)),
          winston.config.colorize('timestamp', options.timestamp()),
          winston.config.colorize(options.level, options.level.toUpperCase()),
          '==>',
          util.format(options.message),
          serialize(options.meta),
        ];
        // If this is a warning or error and we arent verbose then omit prefixes
        if (_.includes(userLevels, options.level) && _.includes(userLevels, logLevelConsole)) {
          return _.drop(output, 2).join(' ');
        }
        return output.join(' ');
      },
      //label: logName,
      label: logName + ' => ' + componentName,
      level: logLevelConsole,
      colorize: true,
    }),
  ];

  // If we have a log path then let's add in some file transports
  if (logDir) {
    // Ensure the log dir actually exists
    mkdirp.sync(logDir);
    // Add in our generic and error logs
    transports.push(new winston.transports.File({
      name: 'error-file',
      label: logName,
      level: 'warn',
      maxSize: 500000,
      maxFiles: 2,
      filename: path.join(logDir, `${logName}-error.log`),
    }));
    transports.push(new winston.transports.File({
      name: 'log-file',
      label: logName,
      level: logLevel,
      maxSize: 500000,
      maxFiles: 3,
      filename: path.join(logDir, `${logName}.log`),
    }));
  };
  
  // Get the winston logger
  super({transports: transports, exitOnError: true, colors: logColors});
  //super({transports: transports, exitOnError: true});

  // Extend with special carryoptics things
  this.sanitizedKeys = ['auth', 'token', 'password', 'key', 'api_key', 'secret', 'machine_token'];
  // Loop through our sanitizedKeys and add sanitation
  _.forEach(this.sanitizedKeys, key => this.rewriters.push(keySanitizer(key)));

  };

  // Method to help other things add sanitizations
  alsoSanitize(key) {
    this.sanitizedKeys.push(key);
    this.rewriters.push(keySanitizer(key));
  };
  
};