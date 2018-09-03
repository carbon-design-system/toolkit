'use strict';

require('dotenv').config();

const {
  DEPLOY_ENV = 'local',
  PROTOCOL = 'https',
  PORT = 3000,
  HOST = 'localhost',
  LOG_LEVEL = 'info',
  NODE_ENV = 'development',
} = process.env;

module.exports = {
  DEPLOY_ENV,
  PROTOCOL,
  PORT,
  HOST,
  LOG_LEVEL,
  NODE_ENV,
};
