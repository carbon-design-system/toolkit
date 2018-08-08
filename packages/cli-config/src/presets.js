'use strict';

const { loadPlugins: defaultLoadPlugins } = require('./plugins');

/**
 * Loads in preset definitions from the given descriptors
 *
 * @param {Array<Descriptor | string>} descriptors
 * @param {Function} resolve
 * @returns {Array<Preset>}
 */
async function loadPresets(descriptors, resolve) {
  const presets = await Promise.all(
    descriptors.map(descriptor => loadPreset(descriptor, resolve))
  );
  const errors = presets.filter(preset => preset.error).map(preset => ({
    name: preset.name,
    options: preset.options,
    error: preset.error.stack,
  }));

  if (errors.length > 0) {
    const error = new Error(
      `Error loading the following presets:\n${JSON.stringify(errors, null, 2)}`
    );
    return {
      error,
      presets: presets.filter(plugin => !plugin.error),
    };
  }

  return {
    presets,
  };
}

/**
 * Loads in a preset from a given descriptor
 *
 * @param {Descriptor | string} descriptor
 * @param {Function} resolve
 * @returns {Plugin}
 */
async function loadPreset(
  descriptor,
  resolve,
  loadPlugins = defaultLoadPlugins
) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error: resolveError, module: getPreset } = await resolve(name);

  if (resolveError) {
    return {
      error: resolveError,
      name,
      options,
    };
  }

  let preset;
  try {
    preset = normalize(getPreset(options));
  } catch (error) {
    return {
      error,
      name,
      options,
    };
  }

  const { plugins: descriptors } = preset;
  const { error: loadPluginsError, plugins } = await loadPlugins(
    descriptors,
    resolve
  );

  if (loadPluginsError) {
    return {
      error: loadPluginsError,
      name,
      options,
    };
  }

  return {
    name,
    plugins,
    options,
  };
}

function normalize(config) {
  return {
    plugins: [],
    ...config,
  };
}

module.exports = {
  loadPresets,
  loadPreset,
};
