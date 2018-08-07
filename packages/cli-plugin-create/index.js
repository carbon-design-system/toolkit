'use strict';

const { clearConsole } = require('@carbon/cli-tools');
const { getClient, createClient } = require('@carbon/npm');
const { createLogger } = require('@carbon/cli-tools');
const fs = require('fs-extra');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const packageJson = require('./package.json');

const logger = createLogger(packageJson.name);

module.exports = async ({ api, env }) => {
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
        return;
      }

      await fs.ensureDir(root);

      const {
        readPackageJson,
        writePackageJson,
        installDependencies,
        linkDependencies,
      } = createClient(npmClient, root);
      const packageJson = {
        name,
        private: true,
        license: 'MIT',
        scripts: {},
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

      console.log(`Success! Created ${name} at ${root}`);
      console.log('Inside that directory, you will find your new project.');
      console.log();
      console.log('We suggest that you begin by typing:');
      console.log();
      console.log(`  cd ${name}`);
      console.log();
      console.log('Happy hacking!');
    },
  });
};
