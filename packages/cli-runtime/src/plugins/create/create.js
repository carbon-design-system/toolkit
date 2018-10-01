/* eslint-disable no-console */

'use strict';

const { createClient } = require('@carbon/npm');
const { ConsoleReporter } = require('@carbon/cli-reporter');
const { clearConsole, createLogger, spawn } = require('@carbon/cli-tools');
const fs = require('fs-extra');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');

const logger = createLogger('@carbon/cli-plugin-create');
const reporter = new ConsoleReporter();
const which = util.promisify(npmWhich);

/**
 * Create a toolkit project with the given name and options.
 */
async function create(name, options, api, env) {
  // Grab the cwd and npmClient off of the environment. We can use these to
  // create the folder for the project and for determining what client to use
  // for npm-related commands
  const { CLI_ENV, cwd, npmClient } = env;
  // We support a couple of options for our `create` command, some only exist
  // during development (like link and linkCli).
  const { link, linkCli, plugins = [], presets = [], skip } = options;
  const root = path.join(cwd, name);

  logger.trace('Creating project:', name, 'at:', root);

  if (await fs.exists(root)) {
    throw new Error(`A folder already exists at \`${root}\``);
  }

  // Create the root directory for the new project
  await fs.ensureDir(root);

  const {
    writePackageJson,
    installDependencies,
    linkDependencies,
  } = await createClient(npmClient, root);
  const packageJson = {
    name,
    private: true,
    license: 'MIT',
    scripts: {},
    dependencies: {},
    devDependencies: {},
    toolkit: {},
  };

  // Write the packageJson to the newly created `root` folder
  await writePackageJson(packageJson);

  const installer = linkCli ? linkDependencies : installDependencies;
  await installer(['@carbon/toolkit']);

  if (CLI_ENV === 'production') {
    clearConsole();
  }

  if (skip) {
    displaySuccess(root, name, npmClient);
    return;
  }

  const toolkit = await which('toolkit', { cwd: root });

  if (presets.length > 0) {
    const args = ['add', ...presets, link && '--link'].filter(Boolean);
    await spawn(toolkit, args, {
      cwd: root,
      stdio: 'inherit',
    });
  }

  if (plugins.length > 0) {
    const args = ['add', ...plugins, link && '--link'].filter(Boolean);
    await spawn(toolkit, args, {
      cwd: root,
      stdio: 'inherit',
    });
  }

  displaySuccess(root, name, npmClient);
}

function displaySuccess(root, name, npmClient) {
  const helpCommand =
    npmClient === 'yarn'
      ? `${npmClient} toolkit --help`
      : `$(${npmClient} bin)/toolkit --help`;

  reporter.success(`Success! Created \`${name}\` at ${root}`);
  reporter.info('Inside that directory, you will find your new project.');
  reporter.info(`We suggest that you begin by typing:

  cd ${name}
  ${helpCommand}
`);
  reporter.info('This should help give you a good idea of what is available.');
  reporter.info('Happy hacking!');
}

module.exports = create;
