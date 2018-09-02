'use strict';

const cosmiconfig = require('cosmiconfig');

function search(name, cwd = process.cwd()) {
  const options = {
    searchPlaces: ['package.json'],
    stopDir: cwd,
  };
  const result = cosmiconfig(name, options).searchSync(cwd);
  if (!result) {
    return {
      noConfig: true,
    };
  }

  const { config, filepath, isEmpty } = result;
  return {
    config,
    filepath,
    isEmpty,
  };
}

module.exports = search;
