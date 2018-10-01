'use strict';

const fs = require('fs-extra');
const path = require('path');

const createClient = jest.fn((npmClient, cwd) => {
  const packageJsonPath = path.join(cwd, 'package.json');

  function readPackageJson() {
    return fs.readJson(packageJsonPath);
  }

  function writePackageJson(packageJson) {
    return fs.writeJson(packageJsonPath, packageJson, {
      spaces: 2,
    });
  }

  const installDependencies = jest.fn();
  const installDevDependencies = jest.fn();
  const linkDependencies = jest.fn();

  createClient.mock.installDependencies = installDependencies;
  createClient.mock.installDevDependencies = installDevDependencies;
  createClient.mock.linkDependencies = linkDependencies;

  return {
    installDependencies,
    installDevDependencies,
    linkDependencies,
    readPackageJson,
    writePackageJson,
  };
});

const getClient = jest.fn(() => Promise.resolve('npm'));
getClient.sync = () => 'npm';

module.exports = {
  getClient,
  createClient,
};
