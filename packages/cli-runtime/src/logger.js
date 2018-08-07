'use strict';

const { createLogger } = require('@carbon/cli-tools');
const packageJson = require('../package.json');

module.exports = {
  logger: createLogger(packageJson.name),
};
