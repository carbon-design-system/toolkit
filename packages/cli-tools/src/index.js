'use strict';

const { clearConsole } = require('./console');
const { logger, createLogger } = require('./logger');
const spawn = require('./spawn');

module.exports = {
  clearConsole,
  createLogger,
  logger,
  spawn,
};
