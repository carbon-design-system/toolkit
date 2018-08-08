'use strict';

module.exports = {
  rules: {
    // we don't do this/care about this
    'init-declarations': 'off',
    // equivalent to jshint W002, catches an IE8 bug
    'no-catch-shadow': 'error',
    // equivalent to jshint W051, is a strict mode violation
    'no-delete-var': 'error',
    // we should avoid labels anyways
    'no-label-var': 'error',
    // redefining undefined, NaN, Infinity, arguments, and eval is bad, mkay?
    'no-shadow-restricted-names': 'error',
    // a definite code-smell, but probably too noisy
    'no-shadow': 'off',
    // it's nice to be explicit sometimes: `let foo = undefined;`
    'no-undef-init': 'error',
    // equivalent to jshint undef, turned into an error in getConfig
    'no-undef': 'error',
    // using undefined is safe because we enforce no-shadow-restricted-names
    'no-undefined': 'off',
    // equivalent to jshint unused
    'no-unused-vars': ['error', { args: 'none' }],
    // too noisy
    'no-use-before-define': 'off',
  },
};
