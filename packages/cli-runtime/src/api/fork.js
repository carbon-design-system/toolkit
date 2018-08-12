'use strict';

const supportedHooks = new Set(['add']);

function fork(config) {
  const { addCommand, extend, read } = config;
  return pluginName => {
    const lifecycle = { add: [] };
    return {
      addCommand(command) {
        return addCommand(command, pluginName);
      },
      read,
      extend,
      fork: fork(config),

      add(thunk) {
        lifecycle.add.push({
          plugin: pluginName,
          thunk,
        });
      },

      async run(hook, options) {
        if (!supportedHooks.has(hook)) {
          throw new Error(
            `Unexpected hook ${hook}. Expected one of ${supportedHooks}`
          );
        }

        if (lifecycle[hook].length === 0) {
          return;
        }

        for (const { pluginName, thunk } of lifecycle[hook]) {
          if (typeof thunk !== 'function') {
            throw new Error(
              `Expected argument for lifecycle event ${hook} to be of type ` +
                `function, instead received \`${typeof thunk}\` for plugin: ` +
                pluginName
            );
          }

          await thunk(options);
        }
      },
    };
  };
}

module.exports = fork;
