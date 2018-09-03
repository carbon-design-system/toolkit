'use strict';

function loadConfig(config, loader) {
  const { presets, plugins } = config;
  return {
    presets: presets.map(descriptor => loadPreset(descriptor, loader)),
    plugins: plugins.map(descriptor => loadPlugin(descriptor, loader)),
  };
}

function loadPlugin(descriptor, loader) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error, module: plugin } = loader(name);

  if (error) {
    return {
      error,
      name,
    };
  }

  if (typeof plugin !== 'function') {
    return {
      error: new Error(
        `Expected the plugin \`${name}\` to export a function, instead ` +
          `recieved: ${typeof plugin}`
      ),
      name,
    };
  }

  return {
    name,
    options,
    plugin,
  };
}

function loadPreset(descriptor, loader) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error: loaderError, module: getPreset } = loader(name);

  if (loaderError) {
    return {
      loaderError,
      name,
    };
  }

  if (typeof getPreset !== 'function') {
    return {
      error: new Error(
        `Expected the preset \`${name}\` to export a function, instead ` +
          `recieved: ${typeof getPreset}`
      ),
      name,
    };
  }

  let preset;
  try {
    preset = getPreset(options);
  } catch (error) {
    return {
      error,
      name,
      options,
    };
  }

  const { presets = [], plugins = [] } = preset;

  return {
    name,
    options,
    presets: presets.map(descriptor => loadPreset(descriptor, loader)),
    plugins: plugins.map(descriptor => loadPlugin(descriptor, loader)),
  };
}

module.exports = {
  loadConfig,
  loadPlugin,
  loadPreset,
};
