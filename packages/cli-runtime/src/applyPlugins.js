'use strict';

const { logger } = require('./logger');

function applyPlugins(api, plugins, env) {
  for (const { name, plugin, options } of plugins) {
    logger.trace(`Applying plugin: ${name}`);
    plugin({
      api: api.fork(name),
      options,
      env,
    });
  }
}

module.exports = applyPlugins;
