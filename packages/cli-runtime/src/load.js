'use strict';

const {
  loadConfig: defaultLoadConfig,
  resolve: defaultResolve,
} = require('@carbon/cli-config');
const { getClient: defaultGetClient } = require('@carbon/npm');
const ora = require('ora');
const { logger } = require('./logger');
const PluginAPI = require('./PluginAPI');
const Store = require('./Store');

const defaultPlugins = [
  {
    name: '@carbon/cli-plugin-add',
    plugin: require('@carbon/cli-plugin-add'),
    options: {},
  },
  {
    name: '@carbon/cli-plugin-create',
    plugin: require('@carbon/cli-plugin-create'),
    options: {},
  },
  {
    name: '@carbon/cli-plugin-init',
    plugin: require('@carbon/cli-plugin-init'),
    options: {},
  },
];

const noopSpinner = {
  start() {},
  stop() {},
  succeed() {},
  fail() {},
  warn() {},
  info() {},
};

async function load({
  cwd = process.cwd(),
  name = 'toolkit',
  getClient = defaultGetClient,
  loadConfig = defaultLoadConfig,
  loader,
  resolve = defaultResolve,
} = {}) {
  logger.trace('Loading runtime configuration');

  const { TOOLKIT_CLI_ENV: CLI_ENV = 'production' } = process.env;
  const store = new Store();
  const api = new PluginAPI({ store });
  const env = {
    CLI_ENV,
    cwd,
    npmClient: await getClient(cwd),
    spinner: CLI_ENV === 'production' ? ora() : noopSpinner,
  };

  await applyPlugins(defaultPlugins, api, env);

  const { error: loadConfigError, config, isEmpty } = await loadConfig({
    cwd,
    loader,
    name,
    resolve,
  });
  if (loadConfigError) {
    return {
      error: loadConfigError,
    };
  }

  if (isEmpty) {
    return {
      api,
      env,
      name,
      store,
    };
  }

  await applyPlugins(config.plugins, api, env);

  return {
    api,
    config,
    env,
    name,
    store,
  };
}

async function applyPlugins(plugins, api, env) {
  for (const { name, plugin, options } of plugins) {
    logger.trace(`Applying plugin: ${name}`);
    await plugin({
      api,
      options,
      env,
    });
  }
}

module.exports = load;
