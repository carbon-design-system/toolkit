'use strict';

const supportedHooks = new Set(['add']);

function fork(config) {
  const { addCommand, extend, read } = config;
  return pluginName => {
    const lifecycle = { add: null };
    return {
      addCommand(command) {
        return addCommand(command, pluginName);
      },
      read,
      extend,
      fork: fork(config),

      add(thunk) {
        if (lifecycle.add) {
          throw new Error(
            'A hook for the `add` Plugin lifecycle method has already been ' +
              `defined in plugin ${pluginName}`
          );
        }
        lifecycle.add = {
          plugin: pluginName,
          thunk,
        };
      },

      run(hook, options) {
        if (!supportedHooks.has(hook)) {
          throw new Error(
            `Unexpected hook ${hook}. Expected one of ${supportedHooks}`
          );
        }

        if (!lifecycle[hook]) {
          return;
        }
        const { pluginName, thunk } = lifecycle[hook];

        if (typeof thunk !== 'function') {
          throw new Error(
            `Expected argument for lifecycle event ${hook} to be of type ` +
              `function, instead received \`${typeof thunk}\` for plugin: ` +
              pluginName
          );
        }

        return thunk(options);
      },
    };
  };
}

module.exports = fork;
