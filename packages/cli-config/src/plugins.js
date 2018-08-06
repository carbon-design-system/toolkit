'use strict';

/**
 * Loads in plugin definitions from the given descriptors
 *
 * @param {Array<Descriptor | string>} descriptor
 * @param {Function} resolve
 * @returns {Array<Plugin>}
 */
async function loadPlugins(descriptors, resolve) {
  const plugins = await Promise.all(
    descriptors.map(descriptor => loadPlugin(descriptor, resolve))
  );
  const errors = plugins.filter(plugin => plugin.error).map(plugin => ({
    name: plugin.name,
    options: plugin.options,
    error: plugin.error.stack,
  }));

  if (errors.length > 0) {
    const error = new Error(
      `Error loading the following plugins:\n${JSON.stringify(errors, null, 2)}`
    );
    return {
      error,
      plugins: plugins.filter(plugin => !plugin.error),
    };
  }

  return {
    plugins,
  };
}

/**
 * Loads in a plugin from a given descriptor
 *
 * @param {Descriptor | string} descriptor
 * @param {Function} resolve
 * @returns {Plugin}
 */
async function loadPlugin(descriptor, resolve) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error, module: plugin } = await resolve(name);

  return {
    error,
    name,
    plugin,
    options,
  };
}

module.exports = {
  loadPlugins,
  loadPlugin,
};
