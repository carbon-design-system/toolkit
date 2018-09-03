'use strict';

module.exports = () => ({
  presets: ['@carbon/cli-preset-test'],
  plugins: [
    '@carbon/cli-plugin-paths',
    '@carbon/cli-plugin-babel',
    '@carbon/cli-plugin-eslint',
    '@carbon/cli-plugin-prettier',
    '@carbon/cli-plugin-editorconfig',
    require.resolve('./plugins/dependencies'),
    require.resolve('./plugins/webpack'),
    require.resolve('./plugins/files'),
  ],
});
