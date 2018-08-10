/* eslint-disable no-console */

'use strict';

const { clearConsole, createLogger, spawn } = require('@carbon/cli-tools');
const { getClient, createClient } = require('@carbon/npm');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');

const logger = createLogger('@carbon/cli-plugin-init');
const which = util.promisify(npmWhich);

module.exports = async ({ api, env }) => {
  const { spinner } = env;

  api.addCommand({
    name: 'init',
    description: 'initialize the toolkit in the current directory',
    options: [
      {
        flags: '--link',
        description: 'link a local plugin to the project',
        development: true,
      },
      {
        flags: '--link-cli',
        description: 'link cli for local development',
        development: true,
      },
      {
        flags: '--npm-client [client]',
        description: 'specify an npm client to use [npm, yarn]',
        defaults: await getClient(env.cwd),
      },
    ],
    async action(cmd) {
      const { cwd, npmClient } = env;
      const { link, linkCli } = cmd;

      logger.trace('Initializing toolkit in folder:', cwd);

      const packageJsonPath = path.join(cwd, 'package.json');

      if (!(await fs.exists(packageJsonPath))) {
        throw new Error(`No \`package.json\` file found at ${packageJsonPath}`);
      }

      const {
        readPackageJson,
        writePackageJson,
        installDependencies,
        linkDependencies,
      } = createClient(npmClient, cwd);
      const initPackageJson = await readPackageJson();

      if (initPackageJson.toolkit) {
        throw new Error(
          `\`package.json\` at ${cwd} has a "toolkit" field already defined`
        );
      }

      initPackageJson.toolkit = {
        plugins: [],
      };

      await writePackageJson(initPackageJson);

      if (env.CLI_ENV === 'production') {
        clearConsole();
      }

      console.log('Hi there! 👋');
      console.log('We have a couple of questions to help get you started');
      console.log();

      const answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'plugins',
          message: 'What plugins would you like to add to your project?',
          choices: [
            {
              name: 'Environment plugin [@carbon/cli-plugin-env]',
              value: '@carbon/cli-plugin-env',
              checked: true,
            },
            {
              name: 'Paths plugin [@carbon/cli-plugin-paths]',
              value: '@carbon/cli-plugin-paths',
            },
          ],
        },
      ]);

      const installer = linkCli ? linkDependencies : installDependencies;
      await installer(['@carbon/toolkit']);

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

      const toolkit = await which('toolkit', { cwd });

      spinner.start();
      spinner.info('Adding plugins');

      for (const plugin of answers.plugins) {
        const args = ['add', plugin, link && '--link'].filter(Boolean);
        await spawn(toolkit, args, {
          cwd,
          stdio: 'inherit',
        });
      }

      spinner.stop();

      console.log();
      console.log(`Success! Initialized toolkit in ${packageJsonPath}`);
      console.log();
      console.log('Happy hacking!');
    },
  });
};
