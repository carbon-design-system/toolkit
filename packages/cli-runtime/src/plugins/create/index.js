/* eslint-disable no-console */

'use strict';

const { getClient } = require('@carbon/npm');
const create = require('./create');

function list(value) {
  return value.split(',');
}

module.exports = async ({ api, env }) => {
  api.addCommand({
    name: 'create <project-name>',
    description: 'create a new project',
    options: [
      {
        flags: '--plugins [plugins...]',
        description: 'Specify a list of plugins to add',
        defaults: list,
      },
      {
        flags: '--npm-client [client]',
        description: 'specify an npm client to use [npm, yarn]',
        defaults: await getClient(env.cwd),
      },
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
    ],
    action(name, cmd) {
      return create(name, cmd, api, env);
    },
  });
};
