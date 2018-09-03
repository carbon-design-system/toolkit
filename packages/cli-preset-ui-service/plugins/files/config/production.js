'use strict';

require('dotenv').config();

const {
  DEPLOY_ENV = 'production',
  PROTOCOL = 'http',
  PORT = 3000,
  HOST = '0.0.0.0',
  LOG_LEVEL = 'info',
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  DEPLOY_ENV,
  PROTOCOL,
  PORT,
  HOST,
  LOG_LEVEL,
  NODE_ENV,
};
