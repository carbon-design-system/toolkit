'use strict';

const { NODE_ENV, LOG_LEVEL } = require('config');
const winston = require('winston');

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format:
    NODE_ENV === 'production' ? winston.format.json() : winston.format.simple(),
  transports: [
    new winston.transports.Console({
      exitOnError: NODE_ENV === 'production',
    }),
  ],
  // transports: [
  // new winston.transports.Console({
  // level: LOG_LEVEL,
  // handleExceptions: NODE_ENV === 'development',
  // timestamp: () => {
  // const now = new Date();

  // return `[${now.toISOString()}]`;
  // },
  // }),
  // ],
  // exitOnError: false,
});

module.exports = logger;
