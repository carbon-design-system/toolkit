'use strict';

// This pattern will match these texts:
//   var Foo = require('Foo');
//   var Bar = require('Foo').Bar;
//   var BarFoo = require(Bar + 'Foo');
//   var {Bar, Foo} = require('Foo');
//   import type {Bar, Foo} from ';
// Also supports 'let' and 'const'.
const variableNamePattern = String.raw`\s*[a-zA-Z_$][a-zA-Z_$\d]*\s*`;
// eslint-disable-next-line prefer-template
const maxLenIgnorePattern =
  String.raw`^(?:var|let|const|import type)\s+` +
  '{?' +
  variableNamePattern +
  '(?:,' +
  variableNamePattern +
  ')*}?' +
  String.raw`\s*(?:=\s*require\(|from)[a-zA-Z_+./"'\s\d\-]+\)?[^;\n]*[;\n]`;

module.exports = {
  rules: {
    'array-bracket-spacing': 'error',
    // TODO: enable this with consensus on single line blocks
    'block-spacing': 'off',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // too noisy at the moment, and jshint didn't check it
    camelcase: ['off', { properties: 'always' }],
    'comma-spacing': ['error', { before: false, after: true }],
    // jshint had laxcomma, but that was against our style guide
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    // we may use more contextually relevant names for this than self
    'consistent-this': ['off', 'self'],
    // should be handled by a generic TXT linter instead
    'eol-last': 'off',
    'func-names': 'off',
    // too noisy ATM
    'func-style': ['off', 'declaration'],
    // no way we could enforce min/max lengths or patterns for vars
    'id-length': 'off',
    'id-match': 'off',
    // we weren't enforcing this with jshint, so erroring would be too noisy
    indent: ['error', 2, { SwitchCase: 1 }],
    // we use single quotes for JS literals, double quotes for JSX literals
    'jsx-quotes': ['error', 'prefer-double'],
    // we may use extra spaces for alignment
    'key-spacing': ['off', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error'],
    'lines-around-comment': 'off',
    // should be handled by a generic TXT linter instead
    'linebreak-style': ['off', 'unix'],
    'max-depth': 'off',
    'max-len': ['error', 120, 2, { ignorePattern: maxLenIgnorePattern }],
    'max-nested-callbacks': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    // https://facebook.com/groups/995898333776940/1027358627297577
    'new-cap': 'off',
    // equivalent to jshint W058
    'new-parens': 'error',
    'newline-after-var': 'off',
    'no-array-constructor': 'error',
    'no-bitwise': 'error',
    'no-continue': 'off',
    'no-inline-comments': 'off',
    // doesn't play well with `if (__DEV__) {}`
    'no-lonely-if': 'off',
    // stopgap, irrelevant if we can eventually turn `indent` on to error
    'no-mixed-spaces-and-tabs': 'error',
    // don't care
    'no-multiple-empty-lines': 'off',
    'no-negated-condition': 'off',
    // we do this a bunch of places, and it's less bad with proper indentation
    'no-nested-ternary': 'off',
    // similar to FacebookWebJSLintLinter's checkPhpStyleArray
    'no-new-object': 'error',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-spaced-func': 'error',
    'no-ternary': 'off',
    // should be handled by a generic TXT linter instead
    'no-trailing-spaces': 'off',
    // we use this for private/protected identifiers
    'no-underscore-dangle': 'off',
    // disallow `let isYes = answer === 1 ? true : false;`
    'no-unneeded-ternary': 'error',
    // too noisy ATM
    'object-curly-spacing': 'off',
    // makes indentation warnings clearer
    'one-var': ['error', { initialized: 'never' }],
    // prefer `x += 4` over `x = x + 4`
    'operator-assignment': ['error', 'always'],
    // equivalent to jshint laxbreak
    'operator-linebreak': 'off',
    'padded-blocks': 'off',
    // probably too noisy on pre-ES5 code
    'quote-props': ['off', 'as-needed'],
    quotes: ['error', 'single', 'avoid-escape'],
    'require-jsdoc': 'off',
    'semi-spacing': ['error', { before: false, after: true }],
    // equivalent to jshint asi/W032
    semi: ['error', 'always'],
    'sort-vars': 'off',
    // require `if () {` instead of `if (){`
    'space-before-blocks': ['error', 'always'],
    // require `function foo()` instead of `function foo ()`
    'space-before-function-paren': [
      'error',
      { anonymous: 'never', named: 'never' },
    ],
    // incompatible with our legacy inline type annotations
    'space-in-parens': ['off', 'never'],
    'space-infix-ops': ['error', { int32Hint: true }],
    'space-unary-ops': ['error', { words: true, nonwords: false }],
    // TODO: Figure out a way to do this that doesn't break typechecks
    // or wait for https://github.com/eslint/eslint/issues/2897
    'spaced-comment': [
      'off',
      'always',
      { exceptions: ['jshint', 'jslint', 'eslint', 'global'] },
    ],
    'wrap-regex': 'off',
  },
};
