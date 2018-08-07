'use strict';

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('@carbon/cli-tools');
const createInstaller = require('./createInstaller');
const { linkDependency, unlinkDependency } = require('./link');

const supportedClients = new Set(['npm', 'yarn']);

function createClient(npmClient, cwd) {
  if (!supportedClients.has(npmClient)) {
    return {
      error: new Error(`Unrecognized npm client: \`${npmClient}\`.`),
    };
  }

  const packageJsonPath = path.join(cwd, 'package.json');
  const installCommand = npmClient === 'yarn' ? 'add' : 'install';
  const runCommand = npmClient === 'yarn' ? 'yarn' : 'npm run';
  const saveFlag = npmClient === 'npm' ? '--save' : null;
  const saveDevFlag = npmClient === 'npm' ? '--save-dev' : '--dev';

  return {
    // `package.json`
    packageJsonPath,
    readPackageJson() {
      return fs.readJson(packageJsonPath);
    },
    writePackageJson(packageJson) {
      return fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
      });
    },

    // Project lifecycle hooks
    init({ stdio = 'inherit', ...rest } = {}) {
      return spawn(npmClient, ['init', '-y'], {
        cwd,
        stdio,
        ...rest,
      });
    },
    install({ stdio = 'inherit', ...rest } = {}) {
      return spawn(npmClient, ['install'], {
        cwd,
        stdio,
        ...rest,
      });
    },

    // Install commands
    installDependencies: createInstaller(
      npmClient,
      cwd,
      installCommand,
      saveFlag
    ),
    installDevDependencies: createInstaller(
      npmClient,
      cwd,
      installCommand,
      saveDevFlag
    ),
    linkDependencies: createInstaller(npmClient, cwd, 'link', null),
    linkDependency: (cwd, options = {}) =>
      linkDependency(npmClient, {
        cwd,
        ...options,
      }),
    unlinkDependency: (cwd, options = {}) =>
      unlinkDependency(npmClient, {
        cwd,
        ...options,
      }),

    // CLI-relevant values
    installCommand,
    runCommand,
    saveFlag,
    saveDevFlag,
  };
}

module.exports = createClient;
