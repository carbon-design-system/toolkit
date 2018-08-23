'use strict';

const {
  loadConfig: defaultLoadConfig,
  resolve: defaultResolve,
} = require('@carbon/cli-config');
const { getClient: defaultGetClient } = require('@carbon/npm');
const { logger } = require('./logger');
const { Store, create } = require('./api');
const applyPlugins = require('./applyPlugins');

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

function load({
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
    npmClient: getClient.sync(cwd),
  };
  const api = create({ env, store });

  applyPlugins(api, defaultPlugins, env);

  const { error: loadConfigError, config, isEmpty } = loadConfig({
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

  if (Array.isArray(config.presets) && config.presets.length > 0) {
    const plugins = config.presets.reduce(
      (acc, preset) => acc.concat(preset.plugins),
      []
    );
    applyPlugins(api, plugins, env);
  }

  applyPlugins(api, config.plugins, env);

  return {
    api,
    config,
    env,
    name,
  };
}

module.exports = load;
