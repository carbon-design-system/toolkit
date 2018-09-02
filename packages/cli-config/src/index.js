'use strict';

const Config = require('./config');
const { loadConfig, loadPlugin } = require('./load');
const { loader: defaultLoader, relativeLoader } = require('./loader');

module.exports = {
  Config,
  loader: defaultLoader,
  relativeLoader,
  loadConfig,
  loadPlugin,
};
