'use strict';

const search = require('./search');
const { loadConfig } = require('./load');
const { relativeLoader } = require('./loader');
const normalize = require('./normalize');
const { validate } = require('./validate/config');

function load({ name, cwd = process.cwd() }) {
  const { noConfig, isEmpty, config: rawConfig, filepath } = search(name, cwd);
  if (noConfig || isEmpty) {
    return {
      noConfig,
      isEmpty,
    };
  }

  const { error: validationError, value } = validate({
    presets: [],
    plugins: [],
    ...rawConfig,
  });
  if (validationError) {
    return {
      error: validationError,
    };
  }

  const { errors, plugins } = normalize(loadConfig(value, relativeLoader(cwd)));
  if (errors) {
    return {
      error: new Error(
        'Error loading plugins for the following reasons:\n\t' +
          errors.map(error => error.message).join('\n\t')
      ),
    };
  }

  return {
    config: rawConfig,
    filepath,
    plugins,
  };
}

module.exports = {
  load,
};
