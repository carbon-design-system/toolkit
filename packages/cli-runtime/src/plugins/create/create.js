/* eslint-disable no-console */

'use strict';

const { clearConsole, createLogger, spawn } = require('@carbon/cli-tools');
const { createClient } = require('@carbon/npm');
const fs = require('fs-extra');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');
const { getPlugins } = require('../tools/prompt');

const logger = createLogger('@carbon/cli-plugin-create');
const which = util.promisify(npmWhich);

async function create(name, cmd, env) {
  const { cwd, npmClient } = env;
  const { link, linkCli, plugins = [] } = cmd;
  const root = path.join(cwd, name);

  logger.trace('Creating project:', name, 'at:', root);

  if (await fs.exists(root)) {
    throw new Error(`A folder already exists at \`${root}\``);
  }

  await fs.ensureDir(root);

  const {
    writePackageJson,
    installDependencies,
    linkDependencies,
  } = createClient(npmClient, root);
  const packageJson = {
    name,
    private: true,
    license: 'MIT',
    scripts: {
      toolkit: 'toolkit',
    },
    dependencies: {},
    toolkit: {
      plugins: [],
    },
  };

  await writePackageJson(packageJson);

  const installer = linkCli ? linkDependencies : installDependencies;
  await installer(['@carbon/toolkit']);

  if (env.CLI_ENV === 'production') {
    clearConsole();
  }

  const toolkit = await which('toolkit', { cwd: root });

  if (plugins.length > 0) {
    const args = ['add', ...plugins, link && '--link'].filter(Boolean);
    await spawn(toolkit, args, {
      cwd: root,
      stdio: 'inherit',
    });
    displaySuccess(root, name);
    return;
  }

  console.log('Hi there! 👋');
  console.log('We have a couple of questions to help get you started');
  console.log();

  const answers = await getPlugins();

  if (answers.plugins.length === 0) {
    displaySuccess(root, name);
    return;
  }

  const args = ['add', ...plugins, link && '--link'].filter(Boolean);
  await spawn(toolkit, args, {
    cwd: root,
    stdio: 'inherit',
  });

  displaySuccess(root, name);
}

function displaySuccess(root, name) {
  console.log();
  console.log(`Success! Created ${name} at ${root}`);
  console.log('Inside that directory, you will find your new project.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(`  cd ${name}`);
  console.log(`  yarn toolkit --help`);
  console.log();
  console.log(
    'This should help give you a good idea of what is available. Also, ' +
      'make sure to check out your `package.json` scripts to see what ' +
      'has been added.'
  );
  console.log();
  console.log('Happy hacking!');
}

module.exports = create;
