'use strict';

const inquirer = require('inquirer');

const plugins = [
  {
    name: 'env',
    pkg: '@carbon/cli-plugin-env',
    description: 'Provides environment information',
  },
  {
    name: 'paths',
    pkg: '@carbon/cli-plugin-paths',
    description: 'Provides project path information',
  },
  {
    name: 'jest',
    pkg: '@carbon/cli-plugin-jest',
    description: 'Setup Jest in a project',
  },
  {
    name: 'enzyme',
    pkg: '@carbon/cli-plugin-enzyme',
    description: 'Setup enzyme for a React-based project using jest',
  },
];

function getPlugins() {
  const choices = plugins.map(plugin => ({
    name: `${plugin.name} (https://npmjs.com/package/${plugin.pkg})`,
    value: plugin.name,
  }));
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'What plugins would you like to add to your project?',
      choices,
    },
  ]);
}

module.exports = {
  getPlugins,
};
