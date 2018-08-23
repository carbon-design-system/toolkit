'use strict';

const createLogger = () => ({
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
});

module.exports = {
  createLogger: jest.fn(createLogger),
  getLogger: jest.fn(createLogger),
};
