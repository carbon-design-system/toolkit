/* eslint-disable no-console */

'use strict';

const { createClient } = require('@carbon/npm');
const fs = require('fs-extra');
const path = require('path');
const { displaySuccess } = require('./display');
const { getPlugins } = require('../tools/prompt');

async function init(api, cmd, env) {
  const { cwd, npmClient } = env;
  const { link, linkCli, skip } = cmd;

  const logger = api.createLogger();

  logger.trace('Initializing toolkit in folder:', cwd);

  const packageJsonPath = path.join(cwd, 'package.json');

  if (!(await fs.exists(packageJsonPath))) {
    throw new Error(`No \`package.json\` file found at ${packageJsonPath}`);
  }

  const {
    error,
    readPackageJson,
    writePackageJson,
    installDependencies,
    linkDependencies,
  } = await createClient(npmClient, cwd);
  if (error) {
    throw error;
  }

  let initPackageJson = await readPackageJson();

  if (initPackageJson.toolkit) {
    throw new Error(
      `\`package.json\` at ${cwd} has a "toolkit" field already defined`
    );
  }

  const installer = linkCli ? linkDependencies : installDependencies;
  await installer(['@carbon/toolkit']);

  initPackageJson = await readPackageJson();
  initPackageJson.toolkit = {
    plugins: [],
  };

  await writePackageJson(initPackageJson);

  api.clearConsole();

  if (skip) {
    displaySuccess(packageJsonPath);
    return;
  }

  console.log('Hi there! 👋');
  console.log('We have a couple of questions to help get you started');
  console.log();

  const answers = await getPlugins(api.prompt);

  if (answers.plugins.length === 0) {
    console.log(
      'If you ever are looking for plugins, feel free to add ones that ' +
        'you find by running:'
    );
    console.log();
    console.log('  toolkit add <plugin-name>');
    console.log();
    console.log('Happy hacking!');
    return;
  }

  const toolkit = await api.which('toolkit', { cwd });
  const args = ['add', ...answers.plugins, link && '--link'].filter(Boolean);

  await api.spawn(toolkit, args, {
    cwd,
    stdio: 'inherit',
  });

  displaySuccess(packageJsonPath);
}

module.exports = init;
