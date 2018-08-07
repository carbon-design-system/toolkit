'use strict';

const { createLogger } = require('@carbon/cli-tools');
const packageJson = require('../package.json');

const logger = createLogger(packageJson.name);

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'add <plugin-name>',
    description: 'add a plugin to your project',
    options: [
      {
        flags: '--pluginOptions <options>',
        description:
          'Provide options to pass to the plugin when adding it to your project',
      },
      {
        flags: '--link',
        description: 'link a local plugin to the project',
        development: true,
      },
      {
        flags: '--link-cli',
        description: 'link for local development',
        development: true,
      },
    ],
    async action(plugin, cmd) {
      await sleep(5000);
    },
  });
};
