'use strict';

const loadConfig = require('./config');
const { loadPresets, loadPreset } = require('./presets');
const { loadPlugin, loadPlugins } = require('./plugins');
const resolve = require('./resolve');

module.exports = {
  loadConfig,
  loadPlugin,
  loadPlugins,
  loadPresets,
  loadPreset,
  resolve,
};
