'use strict';

const runtime = require.requireActual('../');
const env = {
  cwd: '/',
  CLI_ENV: 'test',
  npmClient: 'npm',
};
const api = runtime.api.create({ env });
const config = { plugins: [], presets: [] };
const name = 'mock-runtime';

module.exports = {
  load() {
    return {
      api,
      config,
      env,
      name,
    };
  },
  applyPlugins: runtime.applyPlugins,
};
