'use strict';

const { HOST, PROTOCOL, PORT, NODE_ENV, DEPLOY_ENV } = require('config');
const logger = require('./logger');

const https = shouldUseHTTPS(PROTOCOL, HOST, NODE_ENV, DEPLOY_ENV);
const protocol = https ? 'https' : 'http';

let setupHTTPSServer;

if (https) {
  setupHTTPSServer = require('./setupHTTPSServer');
}

const listen = server => {
  const service = https ? setupHTTPSServer(server) : server;

  return new Promise((resolve, reject) => {
    const handler = service.listen(PORT, HOST, 511, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(handler);
      logger.info(`Server listening at ${protocol}://${HOST}:${PORT}`);
    });
  });
};

function shouldUseHTTPS(PROTOCOL, HOST, NODE_ENV, DEPLOY_ENV) {
  if (
    NODE_ENV === 'development' &&
    PROTOCOL === 'https' &&
    HOST === 'localhost'
  ) {
    return true;
  }

  if (DEPLOY_ENV === 'local' && PROTOCOL === 'https' && HOST === 'localhost') {
    return true;
  }

  return false;
}

module.exports = listen;
