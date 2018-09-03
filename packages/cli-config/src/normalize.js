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

  for (const node of preorder(config)) {
    if (node.type === 'preset') {
      modules[node.name] = node;
      continue;
    }

    if (node.type === 'plugin') {
      if (loadOrder.has(node.name)) {
        const error = new Error(
          `Plugin ${node.name} has been defined multiple times in your config.`
        );
        errors.push({ error });
        break;
      }

      loadOrder.add(node.name);

      if (node.error) {
        errors.push(node);
      }

      modules[node.name] = node;
    }
  }

  if (errors.length > 0) {
    const error = new Error(
      'Error loading plugins for the following reasons:\n\t' +
        errors.map(({ error }) => error.message).join('\n\t')
    );
    return {
      error,
    };
  }

  return {
    loadOrder,
    modules,
    plugins: [...loadOrder].map(id => modules[id]),
  };
}

function* preorder(config, owner = { root: true }) {
  config.owner = owner;
  for (const preset of config.presets) {
    yield {
      ...preset,
      type: 'preset',
      owner,
    };
    yield* preorder(preset, config);
  }

  for (const plugin of config.plugins) {
    yield {
      ...plugin,
      type: 'plugin',
      owner,
    };
  }
}

module.exports = normalize;
