'use strict';

const {
  loadConfig: defaultLoadConfig,
  resolve: defaultResolve,
} = require('@carbon/cli-config');
const { getClient: defaultGetClient } = require('@carbon/npm');
const { logger } = require('./logger');
const { loader: defaultLoader } = require('./loader');
const { validate: defaultValidate } = require('./validation/config');
const PluginAPI = require('./PluginAPI');
const Store = require('./Store');

async function load({
  cwd = process.cwd(),
  name = 'toolkit',
  getClient = defaultGetClient,
  loader = defaultLoader,
  loadConfig = defaultLoadConfig,
  resolve = defaultResolve,
  validate = defaultValidate,
} = {}) {
  logger.trace('Loading runtime configuration');

  const env = {
    cwd,
    npmClient: await getClient(cwd),
  };
  const store = new Store();
  const api = new PluginAPI({ store });

  const { error: loaderError, isEmpty, config: rawConfig } = await loader(
    name,
    cwd
  );
  if (loaderError) {
    return {
      error: loaderError,
    };
  }

  if (isEmpty) {
    return {
      name,
      store,
      env,
    };
  }

  const { error: validationError, value } = validate(normalize(rawConfig));
  if (validationError) {
    return {
      error: validationError,
    };
  }

  const { error: loadConfigError, config } = await loadConfig(value, resolve);
  if (loadConfigError) {
    return {
      error: loadConfigError,
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

function normalize(config) {
  return {
    presets: [],
    plugins: [],
    ...config,
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
