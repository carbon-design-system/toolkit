'use strict';

const { load } = require('@carbon/cli-runtime');

module.exports = () => {
  const { api } = load();
  const babelConfig = api.store.read('babel');
  return babelConfig;
};
