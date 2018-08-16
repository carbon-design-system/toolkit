'use strict';

const {
  clearConsole,
  createLogger,
  spawn: crossSpawn,
} = require('@carbon/cli-tools');
const inquirer = require('inquirer');
const ora = require('ora');
const npmWhich = require('npm-which');
const util = require('util');

const devSpinner = ['start', 'stop', 'succeed', 'fail', 'warn', 'info'].reduce(
  (acc, method) => ({
    ...acc,
    [method](...args) {
      // eslint-disable-next-line no-console
      console.log(`[${method.toUpperCase()}]`, ...args);
    },
  }),
  {}
);
const supportedHooks = new Set(['add', 'update', 'upgrade']);

function fork(config) {
  const { addCommand, env, extend, read } = config;
  const { CLI_ENV } = env;
  const which = util.promisify(npmWhich(__dirname));
  return pluginName => {
    const lifecycle = { add: [], update: [], upgrade: [] };
    return {
      clearConsole() {
        if (CLI_ENV === 'production') {
          clearConsole();
        }
      },
      createLogger() {
        return createLogger(pluginName);
      },
      extend,
      read,
      prompt: inquirer.prompt,
      async spawn(...args) {
        try {
          await crossSpawn(...args);
        } catch (error) {
          process.exit(1);
        }
      },
      spinner: CLI_ENV === 'production' ? ora() : devSpinner,
      fork: fork(config),
      which,

      addCommand(command) {
        return addCommand(command, pluginName);
      },

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
