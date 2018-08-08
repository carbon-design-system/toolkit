'use strict';

module.exports = {
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/check-param-names': 2,
    'jsdoc/check-tag-names': 2,
    'jsdoc/check-types': 2,
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        augments: 'extends',
      },
    },
  },
};
