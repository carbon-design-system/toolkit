'use strict';

const listen = require('./listen');
const logger = require('./logger');

const register = setupServer =>
  Promise.resolve(setupServer())
    .then(listen)
    .catch(error => {
      logger.error(error);
    });

module.exports = register;
