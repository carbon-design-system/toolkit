'use strict';

const loadConfig = require('./config');
const { loadPresets } = require('./presets');
const { loadPlugin, loadPlugins } = require('./plugins');
const resolve = require('./resolve');

module.exports = {
  loadConfig,
  loadPlugin,
  loadPlugins,
  resolve,
};
