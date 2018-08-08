'use strict';

module.exports = {
  extends: [
    require.resolve('./rules/possible-errors'),
    require.resolve('./rules/limit-language-features'),
    require.resolve('./rules/stylistic-issues'),
    require.resolve('./plugins/scss'),
  ],
  plugins: ['stylelint-scss'],
};
