/* eslint-disable no-console */

'use strict';

const { clearConsole, createLogger, spawn } = require('@carbon/cli-tools');
const { getClient, createClient } = require('@carbon/npm');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');

const which = util.promisify(npmWhich);

const logger = createLogger('@carbon/cli-plugin-create');

module.exports = async ({ api, env }) => {
  const { spinner } = env;

  api.addCommand({
    name: 'create <project-name>',
    description: 'create a new project',
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
    async action(name, cmd) {
      const { cwd, npmClient } = env;
      const { link, linkCli } = cmd;
      const root = path.join(cwd, name);

      logger.trace('Creating project:', name, 'at:', root);

      if (await fs.exists(root)) {
        throw new Error(`A folder already exists at ${root}`);
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
            {
              name: 'Jest',
              value: '@carbon/cli-plugin-jest',
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
        console.log('  yarn toolkit add <plugin-name>');
        console.log();
        console.log('You can now view your project in:', name);
        console.log();
        console.log('We suggest that you begin by typing:');
        console.log();
        console.log(`  cd ${name}`);
        console.log();
        console.log('Happy hacking!');
        return;
      }

      const toolkit = await which('toolkit', { cwd: root });

      spinner.start();
      spinner.info('Adding plugins');

      for (const plugin of answers.plugins) {
        const args = ['add', plugin, link && '--link'].filter(Boolean);
        await spawn(toolkit, args, {
          cwd: root,
          stdio: 'inherit',
        });
      }

      spinner.stop();

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
    },
  });
};
