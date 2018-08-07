'use strict';

module.exports = ({ api, env }) => {
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
    ],
    async action(name, cmd) {
      console.log('Creating project:', name);
    },
  });
};
