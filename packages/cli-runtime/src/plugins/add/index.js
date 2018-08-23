'use strict';

const add = require('./add');

module.exports = ({ api, env }) => {
  api.addCommand({
    // name: 'add <plugin|preset> [presets|plugins...]',
    name: 'add [plugins|presets...]',
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
    action(descriptors, cmd) {
      return add(api, env, descriptors, cmd);
    },
  });
};
