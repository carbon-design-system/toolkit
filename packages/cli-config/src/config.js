'use strict';

const search = require('./search');
const { loadConfig } = require('./load');
const { relativeLoader } = require('./loader');
const normalize = require('./normalize');
const { validate } = require('./validate/config');

function load({ name, cwd = process.cwd() }) {
  const { noConfig, isEmpty, config: rawConfig, filepath } = search(name, cwd);
  if (noConfig || isEmpty) {
    return {
      noConfig,
      isEmpty,
    };
  }

  const { error: validationError, value } = validate({
    presets: [],
    plugins: [],
    ...rawConfig,
  });
  if (validationError) {
    return {
      error: validationError,
    };
  }

  const { error: normalizeError, modules, plugins } = normalize(
    loadConfig(value, relativeLoader(cwd))
  );
  if (normalizeError) {
    return {
      error: normalizeError,
    };
  }

  return {
    config: createConfig(modules),
    filepath,
    plugins,
  };
}

function createConfig(modules) {
  const all = () => modules;
  const has = pluginOrPreset => {
    return !!modules[pluginOrPreset];
  };
  const why = pluginOrPreset => {
    if (!has(pluginOrPreset)) {
      return {
        available: false,
        message: 'Plugin or preset not found in loaded modules',
      };
    }

    let node = modules[pluginOrPreset];
    while (!node.owner.root) {
      node = node.owner;
    }

    return {
      available: true,
      message: node.name,
    };
  };

  return {
    all,
    has,
    why,
  };
}

module.exports = {
  load,
};
