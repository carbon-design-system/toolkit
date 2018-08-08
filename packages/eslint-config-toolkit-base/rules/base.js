'use strict';

module.exports = {
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],

    // equivalent to jshint boss
    'no-cond-assign': 'off',
    'no-console': 'error',
    // prohibits things like `while (true)`
    'no-constant-condition': 'off',
    // we need to be able to match these
    'no-control-regex': 'off',
    // equivalent to jshint debug
    'no-debugger': 'error',
    // equivalent to jshint W004
    'no-dupe-args': 'error',
    // syntax error in strict mode, almost certainly unintended in any case
    'no-dupe-keys': 'error',
    // almost certainly a bug
    'no-duplicate-case': 'error',
    // almost certainly a bug
    'no-empty-character-class': 'error',
    // would warn on uncommented empty `catch (ex) {}` blocks
    'no-empty': 'off',
    // can cause subtle bugs in IE 8, and we shouldn't do this anyways
    'no-ex-assign': 'error',
    // we shouldn't do this anyways
    'no-extra-boolean-cast': 'error',
    // parens may be used to improve clarity, equivalent to jshint W068
    'no-extra-parens': ['error', 'functions'],
    // equivalent to jshint W032
    'no-extra-semi': 'error',
    // a function delaration shouldn't be rewritable
    'no-func-assign': 'error',
    // babel and es6 allow block-scoped functions
    'no-inner-declarations': 'off',
    // will cause a runtime error
    'no-invalid-regexp': 'error',
    // disallow non-space or tab whitespace characters
    'no-irregular-whitespace': 'error',
    // write `if (!(a in b))`, not `if (!a in b)`, equivalent to jshint W007
    'no-negated-in-lhs': 'error',
    // will cause a runtime error
    'no-obj-calls': 'error',
    // improves legibility
    'no-regex-spaces': 'error',
    // equivalent to jshint elision
    'no-sparse-arrays': 'error',
    // equivalent to jshint W027
    'no-unreachable': 'error',
    // equivalent to jshint use-isnan
    'use-isnan': 'error',
    // probably too noisy ATM
    'valid-jsdoc': 'off',
    // equivalent to jshint notypeof
    'valid-typeof': 'error',
    // we already require semicolons
    'no-unexpected-multiline': 'off',
  },
};
