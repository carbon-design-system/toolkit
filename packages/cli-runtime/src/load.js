'use strict';

const {
  loadConfig: defaultLoadConfig,
  resolve: defaultResolve,
} = require('@carbon/cli-config');
const { getClient: defaultGetClient } = require('@carbon/npm');
const { logger } = require('./logger');
const { Store, create } = require('./api');

const defaultPlugins = [
  {
    name: '@carbon/cli-plugin-add',
    plugin: require('./plugins/add'),
    options: {},
  },
  {
    name: '@carbon/cli-plugin-create',
    plugin: require('./plugins/create'),
    options: {},
  },
  {
    name: '@carbon/cli-plugin-init',
    plugin: require('./plugins/init'),
    options: {},
  },
];

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
  const env = {
    CLI_ENV,
    cwd,
    npmClient: await getClient(cwd),
  };
  const api = create({ env, store });

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
      api: api.fork(name),
      options,
      env,
    });
  }
}

module.exports = load;
