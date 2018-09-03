'use strict';

module.exports = () => ({
  presets: ['@carbon/cli-preset-test'],
  plugins: [
    '@carbon/cli-plugin-env',
    '@carbon/cli-plugin-paths',
    '@carbon/cli-plugin-babel',
    require.resolve('./plugins/files'),
    require.resolve('./plugins/react'),
    require.resolve('./plugins/webpack'),
    '@carbon/cli-plugin-editorconfig',
    '@carbon/cli-plugin-eslint',
    '@carbon/cli-plugin-prettier',
  ],
});
