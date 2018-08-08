'use strict';

const cosmiconfig = require('cosmiconfig');

/**
 * @typedef LoaderResult
 * @property {Error} error
 * @property {boolean} isEmpty
 * @property {Object} config
 */

/**
 * @param {string} name The name of your module
 * @param {string} cwd The current directory of the process
 * @returns LoaderResult
 */
async function loader(name, cwd = process.cwd()) {
  const options = {
    searchPlaces: ['package.json'],
    stopDir: cwd,
  };
  const result = await cosmiconfig(name, options).search(cwd);
  if (result === null) {
    return { isEmpty: true };
  }

  const { config, filepath, isEmpty } = result;
  return {
    config,
    filepath,
    isEmpty,
  };
}

module.exports = {
  loader,
};
