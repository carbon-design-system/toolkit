'use strict';

const { loadPresets } = require('./presets');
const { loadPlugins } = require('./plugins');
const defaultResolve = require('./resolve');

async function loadConfig(rawConfig, resolve = defaultResolve) {
  const config = normalize(rawConfig);
  const { error: loadPresetsError, presets } = await loadPresets(
    config.presets,
    resolve
  );

  if (loadPresetsError) {
    return {
      error: loadPresetsError,
    };
  }

  const { error: loadPluginsError, plugins } = await loadPlugins(
    config.plugins,
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
