'use strict';

const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options = {}) => {
  api.assertVersion(7);
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: ['extends browserslist-config-toolkit'],
          },
          ...options,
        },
      ],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          helpers: false,
          regenerator: true,
        },
      ],

      // Stage 2
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      require.resolve('@babel/plugin-proposal-function-sent'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-proposal-numeric-separator'),
      require.resolve('@babel/plugin-proposal-throw-expressions'),

      // Stage 3
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-import-meta'),
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: false },
      ],
      require.resolve('@babel/plugin-proposal-json-strings'),
    ],
  };
});
