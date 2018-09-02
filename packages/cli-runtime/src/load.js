'use strict';

const {
  // loadConfig: defaultLoadConfig,
  // resolve: defaultResolve,
  Config,
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
  const { error: loadConfigError, plugins, isEmpty, noConfig } = Config.load({
    cwd,
    name,
  });
  if (loadConfigError) {
    return {
      error: loadConfigError,
    };
  }

  applyPlugins(api, defaultPlugins, env);

  if (noConfig || isEmpty) {
    return {
      api,
      env,
      name,
      store,
    };
  }

  applyPlugins(api, plugins, env);

  return {
    api,
    env,
    name,
    plugins,
  };
}

module.exports = load;
