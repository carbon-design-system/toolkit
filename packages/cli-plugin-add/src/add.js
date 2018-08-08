'use strict';

const {
  loadConfig,
  loadPlugin,
  resolve: defaultResolve,
} = require('@carbon/cli-config');
const { createLogger } = require('@carbon/cli-tools');
const { createClient, getPackageInfoFrom } = require('@carbon/npm');
const fs = require('fs-extra');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const invariant = require('invariant');
const util = require('util');

const packageJson = require('../package.json');

const logger = createLogger(packageJson.name);
const which = util.promisify(npmWhich);

async function add(api, env, descriptors, cmd) {
  const { cwd, npmClient, spinner } = env;
  const packages = descriptors.map(getPackageInfoFrom);
  const {
    error,
    readPackageJson,
    writePackageJson,
    linkDependencies,
    installDependencies,
    installDevDependencies,
  } = createClient(npmClient, cwd);
  if (error) {
    throw error;
  }

  const { error: loadConfigError, config } = await loadConfig({ cwd: env.cwd });
  if (loadConfigError) {
    throw loadConfigError;
  }

  for (const { name, version } of packages) {
    spinner.text = `Adding plugin ${name}`;

    invariant(
      !config.plugins.find(plugin => plugin.name === name),
      'Plugin `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );

    const installer = cmd.link ? linkDependencies : installDependencies;
    const dependency = cmd.link ? name : `${name}@${version}`;

    await installer([dependency]);

    const projectPackageJson = await readPackageJson();
    await writePackageJson({
      ...projectPackageJson,
      toolkit: {
        ...projectPackageJson.toolkit,
        plugins: [...projectPackageJson.toolkit.plugins, name],
      },
    });

    spinner.succeed();
  }
}

module.exports = add;
