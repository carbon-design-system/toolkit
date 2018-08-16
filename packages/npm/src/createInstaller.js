'use strict';

const { spawn } = require('@carbon/cli-tools');

/**
 * @typedef Package
 * @property {string} name the name of the package
 * @property {string} version the version of the package
 */

/**
 * Create an installer for production and development dependencies.
 *
 * @param {string} npmClient the client to use for the install commands
 * @param {string} cwd the directory where you run the command
 * @param {string} installCommand the command to use to install dependencies for
 * the client
 * @param {string} saveFlag the flag used to save the dependencies in the
 * client's lockfile
 * @returns {Function}
 */
function createInstaller(
  npmClient,
  cwd,
  installCommand,
  saveFlag,
  isWorkspaceRoot
) {
  /**
   * Runs the install command for the given packages
   *
   * @param {Array<Package|string>} packages
   * @param {Object} options
   * @returns {Promise}
   */
  return function installer(packages, { stdio = 'inherit', ...rest } = {}) {
    const dependencies = Array.isArray(packages)
      ? getDependenciesFromArray(packages, installCommand)
      : getDependenciesFromObject(packages, installCommand);

    const args = [
      installCommand,
      ...dependencies,
      installCommand !== 'link' && isWorkspaceRoot ? '--dev' : saveFlag,
      isWorkspaceRoot && '-W',
    ].filter(Boolean);
    return spawn(npmClient, args, {
      cwd,
      stdio,
      ...rest,
    });
  };
}

function getDependenciesFromObject(packages, installCommand) {
  return Object.keys(packages).map(name => {
    if (installCommand === 'link') {
      return name;
    }

    const version = packages[name];
    return `${name}@${version}`;
  });
}

function getDependenciesFromArray(packages, installCommand) {
  return packages.map(pkg => {
    if (typeof pkg === 'string') {
      return pkg;
    }
    if (installCommand === 'link') {
      return pkg.name;
    }
    return `${pkg.name}@${pkg.version}`;
  });
}

module.exports = createInstaller;
