'use strict';

module.exports = () => ({
  presets: [],
  plugins: [
    '@carbon/cli-plugin-babel',
    '@carbon/cli-plugin-editorconfig',
    '@carbon/cli-plugin-github-files',
    '@carbon/cli-plugin-jest',
    '@carbon/cli-plugin-prettier',
    '@carbon/cli-plugin-stylelint',
  ],
});
