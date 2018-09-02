'use strict';

// What happens if we have the same plugin with different options?
// What happens if we have the same plugin load successfully once but not
// another time?
// What about the same question above but with presets?

// Some constraints/opinions we're introducing to try and make this a little
// simpler:
//   - Plugins can only be loaded _once_
//   - Duplicate plugins is an error
// Flatten hierarchy into an ordered set of plugins to apply
//
// Report any nested errors as a collection of errors to report back
//
// Order goes from presets -> plugins, prioritizing all plugins in first
// preset, then second preset, following onto plugins at the root level
//
// De-dupe list of plugins. Note: Do we need to worry about versions?
function normalize(config) {
  const errors = [];
  const modules = {};
  const loadOrder = new Set();

  for (const plugin of preorder(config)) {
    if (loadOrder.has(plugin.name)) {
      const error = new Error(
        `Plugin ${plugin.name} has been defined multiple times in your config.`
      );
      errors.push(error);
      break;
    }

    loadOrder.add(plugin.name);

    if (plugin.error) {
      errors.push(plugin);
    }

    modules[plugin.name] = plugin;
  }

  return {
    errors: errors.length > 0 ? errors : null,
    plugins: [...loadOrder].map(id => modules[id]),
  };
}

function* preorder(config) {
  for (const preset of config.presets) {
    yield* preorder(preset);
  }

  for (const plugin of config.plugins) {
    yield plugin;
  }
}

module.exports = normalize;
