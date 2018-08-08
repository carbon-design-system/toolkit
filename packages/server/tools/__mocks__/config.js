'use strict';

const config = Object.create(null);

const __setConfig = nextConfig => {
  Object.assign(config, nextConfig, {
    __setConfig,
  });
};

config.__setConfig = __setConfig;

module.exports = config;
