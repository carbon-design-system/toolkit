'use strict';

const log4js = require('log4js');

const { LOG_LEVEL = 'none' } = process.env;

function createLogger(name) {
  const logger = log4js.getLogger(name);

  logger.level = LOG_LEVEL;

  return logger;
}

module.exports = {
  logger: createLogger('@carbon/toolkit'),
  createLogger,
};
