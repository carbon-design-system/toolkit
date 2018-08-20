'use strict';

const { load } = require('@carbon/cli-runtime');

module.exports = () => {
  const { api } = load();
  const eslintConfig = api.store.read('eslint');
  return eslintConfig;
};
