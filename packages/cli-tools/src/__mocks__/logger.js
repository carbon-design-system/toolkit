'use strict';

function createLogger(name) {
  return {
    __name__: name,
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };
}

module.exports = {
  logger: createLogger('@carbon/toolkit'),
  createLogger,
};
