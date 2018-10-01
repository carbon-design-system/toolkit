'use strict';

/**
 * Describes a plugin or preset. Contains a string for the name of the plugin or
 * preset, or a [string, Object] tuple where the first element is the name and
 * the second element is the options for the plugin or preset.
 * @typedef {(string|[string, Object])} Descriptor
 */

/**
 * A collection of preset and plugin descriptors to try and load.
 * @typedef Config
 * @property {Descriptor[]} presets
 * @property {Descriptor[]} plugins
 */

/**
 * @typdef LoadedModule
 * @property {?Error} error - an error occurred while loading the module
 * @property {?Function} module - the loaded module
 */

/**
 * @typedef Loader
 * @param {string} name - the name of the module to load
 * @returns {LoadedModule}
 */

/**
 * Load the given configuration using the given loader.
 * @param {Config} config - the configuration to load
 * @param {Loader} loader - a loader to load plugins or presets by name
 */
function loadConfig(config, loader) {
  const { presets, plugins } = config;
  return {
    presets: presets.map(descriptor => loadPreset(descriptor, loader)),
    plugins: plugins.map(descriptor => loadPlugin(descriptor, loader)),
  };
}

/**
 * Load the plugin descriptor with the given loader
 * @param {Descriptor} descriptor
 * @param {Loader} loader
 */
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

/**
 * Load the preset with the given loader
 * @param {Descriptor} descriptor
 * @param {Loader} loader
 */
function loadPreset(descriptor, loader) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error: loaderError, module: getPreset } = loader(name);

  if (loaderError) {
    return {
      error: loaderError,
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
