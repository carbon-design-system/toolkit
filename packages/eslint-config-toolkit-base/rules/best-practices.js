'use strict';

module.exports = {
  rules: {
    // probably a bug, we shouldn't actually even use this yet, because of IE8
    'accessor-pairs': ['error', { setWithoutGet: true }],
    // probably too noisy ATM
    'block-scoped-var': 'off',
    // cyclomatic complexity, we're too far gone
    complexity: 'off',
    // require return statements to either always or never specify values
    'consistent-return': 'off',
    // style guide: Always use brackets, even when optional.
    curly: ['error', 'all'],
    // we don't do this/care about this
    'default-case': 'off',
    // disabled in favor of our temporary fork
    'dot-notation': 'off',
    // we don't do this/care about this, but probably should eventually
    'dot-location': 'off',
    // disabled as it's too noisy ATM
    eqeqeq: ['off', 'allow-null'],
    // we don't do this/care about this, equivalent to jshint forin
    'guard-for-in': 'off',
    // we have too many internal examples/tools using this
    'no-alert': 'off',
    // incompatible with 'use strict' equivalent to jshint noarg
    'no-caller': 'error',
    // we don't care about this right now, but might later
    'no-case-declarations': 'off',
    // we don't do this/care about this
    'no-div-regex': 'off',
    // we don't do this/care about this
    'no-else-return': 'off',
    // avoid mistaken variables when destructuring
    'no-empty-pattern': 'error',
    // see eqeqeq: we explicitly allow this, equivalent to jshint eqnull
    'no-eq-null': 'off',
    // equivalent to jshint evil
    'no-eval': 'error',
    // should only be triggered on polyfills, which we can fix case-by-case
    'no-extend-native': 'error',
    // might be a sign of a bug
    'no-extra-bind': 'error',
    // equivalent to jshint W089
    'no-fallthrough': 'error',
    // equivalent to jshint W008
    'no-floating-decimal': 'error',
    // implicit coercion is often idiomatic
    'no-implicit-coercion': 'off',
    // equivalent to jshint evil/W066
    'no-implied-eval': 'error',
    // will likely create more signal than noise
    'no-invalid-this': 'off',
    // babel should handle this fine
    'no-iterator': 'off',
    // Should be effectively equivalent to jshint W028 - allowing the use
    // of labels in very specific situations. ESLint no-empty-labels was
    // deprecated.
    'no-labels': ['error', { allowLoop: true, allowSwitch: true }],
    // lone blocks create no scope, will ignore blocks with let/const
    'no-lone-blocks': 'error',
    // equivalent to jshint loopfunc
    'no-loop-func': 'off',
    // we surely have these, don't bother with it
    'no-magic-numbers': 'off',
    // we may use this for alignment in some places
    'no-multi-spaces': 'off',
    // equivalent to jshint multistr, consider using es6 template strings
    'no-multi-str': 'error',
    // equivalent to jshint W02'off', similar to no-extend-native
    'no-native-reassign': ['error', { exceptions: ['Map', 'Set'] }],
    // equivalent to jshint evil/W054
    'no-new-func': 'error',
    // don't use constructors for side-effects, equivalent to jshint nonew
    'no-new': 'error',
    // very limited uses, mostly in third_party
    'no-new-wrappers': 'error',
    // deprecated in ES5, but we still use it in some places
    'no-octal-escape': 'error',
    // deprecated in ES5, may cause unexpected behavior
    'no-octal': 'error',
    // treats function parameters as constants, probably too noisy ATM
    'no-param-reassign': 'off',
    // only relevant to node code
    'no-process-env': 'off',
    // deprecated in ES3.'error', equivalent to jshint proto
    'no-proto': 'error',
    // jshint doesn't catch this, but this is inexcusable
    'no-redeclare': 'error',
    // equivalent to jshint boss
    'no-return-assign': 'off',
    // equivalent to jshint scripturl
    'no-script-url': 'error',
    // not in jshint, but is in jslint, and is almost certainly a mistake
    'no-self-compare': 'error',
    // there are very limited valid use-cases for this
    'no-sequences': 'error',
    // we're already pretty good about this, and it hides stack traces
    'no-throw-literal': 'error',
    // breaks on `foo && foo.bar()` expression statements, which are common
    'no-unused-expressions': 'off',
    // disallow unnecessary .call() and .apply()
    'no-useless-call': 'error',
    // disallow concatenating string literals
    'no-useless-concat': 'error',
    // this has valid use-cases, eg. to circumvent no-unused-expressions
    'no-void': 'off',
    // this journey is 1% finished (allow TODO comments)
    'no-warning-comments': 'off',
    // equivalent to jshint withstmt
    'no-with': 'off',
    // require radix argument in parseInt, we do this in most places already
    radix: 'error',
    // we don't do this/care about this
    'vars-on-top': 'off',
    // equivalent to jshint immed
    'wrap-iife': 'off',
    // probably too noisy ATM
    yoda: 'off',
  },
};
