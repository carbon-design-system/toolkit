'use strict';

const add = require('./add');

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'add [plugins...]',
    description: 'add plugins to your project',
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
    ],
    action(plugins, cmd) {
      return add(api, env, plugins, cmd);
    },
  });
};
