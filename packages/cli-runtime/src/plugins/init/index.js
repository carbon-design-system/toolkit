/* eslint-disable no-console */

'use strict';

const { getClient } = require('@carbon/npm');
const init = require('./init');

module.exports = ({ api, env }) => {
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
        defaults: getClient.sync(env.cwd),
      },
      {
        flags: '--skip',
        description: 'Skip the prompt for plugins',
        defaults: false,
      },
    ],
    action(cmd) {
      return init(api, cmd, env);
    },
  });
};
