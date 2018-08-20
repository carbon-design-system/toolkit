'use strict';

const { loader: defaultLoader } = require('./loader');
const { loadPresets } = require('./presets');
const { loadPlugins } = require('./plugins');
const defaultResolve = require('./resolve');
const { validate: defaultValidate } = require('./validation/config');

function loadConfig({
  cwd = process.cwd(),
  name = 'toolkit',
  loader = defaultLoader,
  resolve = defaultResolve,
  validate = defaultValidate,
}) {
  const { error: loaderError, isEmpty, config: rawConfig } = loader(name, cwd);
  if (loaderError) {
    return {
      error: loaderError,
    };
  }

  if (isEmpty) {
    return {
      isEmpty,
    };
  }

  const { error: validationError, value } = validate(normalize(rawConfig));
  if (validationError) {
    return {
      error: validationError,
    };
  }

  const { error: loadPresetsError, presets } = loadPresets(
    value.presets,
    resolve
  );

  if (loadPresetsError) {
    return {
      error: loadPresetsError,
    };
  }

  const { error: loadPluginsError, plugins } = loadPlugins(
    value.plugins,
    resolve
  );

  if (loadPluginsError) {
    return {
      error: loadPluginsError,
    };
  }

  return {
    config: {
      plugins: presets
        .reduce((acc, preset) => acc.concat(preset.plugins), [])
        .concat(plugins),
    },
  };
}

function normalize(config) {
  return {
    presets: [],
    plugins: [],
    ...config,
  };
}

module.exports = loadConfig;
