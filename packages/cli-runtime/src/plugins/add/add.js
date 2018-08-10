'use strict';

const { loadConfig, loadPlugin, resolve } = require('@carbon/cli-config');
const { createClient, getPackageInfoFrom } = require('@carbon/npm');
const npmWhich = require('npm-which')(__dirname);
const invariant = require('invariant');
const { create } = require('./project');
const util = require('util');

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

  if (!config) {
    throw new Error(`No configuration found for toolkit in: ${env.cwd}`);
  }

  for (const { name, version } of packages) {
    spinner.text = `Adding plugin ${name}`;
    spinner.start();

    invariant(
      !config.plugins.find(plugin => plugin.name === name),
      'Plugin `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );

    const installer = cmd.link ? linkDependencies : installDependencies;
    const dependency = cmd.link ? name : `${name}@${version}`;

    await installer([dependency], {
      stdio: 'ignore',
    });

    const projectPackageJson = await readPackageJson();
    await writePackageJson({
      ...projectPackageJson,
      toolkit: {
        ...projectPackageJson.toolkit,
        plugins: [...projectPackageJson.toolkit.plugins, name],
      },
    });

    const { error: loadPluginError, options, plugin } = await loadPlugin(
      name,
      resolve
    );
    if (loadPluginError) {
      throw loadPluginError;
    }

    const lifecycle = api.fork(name);

    await plugin({
      api: lifecycle,
      options,
      env,
    });

    await lifecycle.run(
      'add',
      create({
        cliPath: cmd.linkCli ? await which('toolkit') : 'toolkit',
        npmClient,
        readPackageJson,
        writePackageJson,
        installDependencies,
        installDevDependencies,
        linkDependencies,
        root: cwd,
      })
    );

    spinner.succeed();
  }
}

module.exports = add;
