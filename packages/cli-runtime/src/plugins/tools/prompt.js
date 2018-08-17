'use strict';

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
    name: 'prettier',
    pkg: '@carbon/cli-plugin-prettier',
    description: 'Setup prettier to format files in your codebase',
  },
  {
    name: 'eslint',
    pkg: '@carbon/cli-plugin-eslint',
    description: 'Setup eslint for your project',
  },
  {
    name: 'stylelint',
    pkg: '@carbon/cli-plugin-stylelint',
    description: 'Setup eslint for your project',
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
  {
    name: 'github-files',
    pkg: '@carbon/cli-plugin-github-files',
    description: 'Helps setup multiple issue templates for your project',
  },
  {
    name: 'editorconfig',
    pkg: '@carbon/cli-plugin-editorconfig',
    description: 'Setup an editorconfig file for your project',
  },
];

function getPlugins(prompt) {
  const choices = plugins.map(plugin => ({
    name: `${plugin.name} (https://npmjs.com/package/${plugin.pkg})`,
    value: plugin.pkg,
  }));
  return prompt([
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
