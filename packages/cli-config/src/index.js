'use strict';

const Config = require('./config');
const { loadConfig, loadPlugin, loadPreset: _loadPreset } = require('./load');
const { loader: defaultLoader, relativeLoader } = require('./loader');
const normalize = require('./normalize');

module.exports = {
  Config,
  loader: defaultLoader,
  relativeLoader,
  loadConfig,
  loadPlugin,
  loadPreset(name, loader) {
    return normalize(_loadPreset(name, loader));
  },
};
