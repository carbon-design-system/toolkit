'use strict';

module.exports = ({ api }) => {
  api.extend('env', () => {
    const { NODE_ENV = 'development' } = process.env;
    // Grab NODE_ENV and *_UI_* environment variables and prepare them to be
    // injected into the application via DefinePlugin in Webpack configuration.
    const PACKAGE_NAMES = [/^_UI_/i];

    const raw = Object.keys(process.env)
      .filter(key => PACKAGE_NAMES.some(NAME => NAME.test(key)))
      .reduce(
        // eslint-disable-next-line arrow-body-style
        (env, key) => {
          env[key] = process.env[key];
          return env;
        },
        {
          // Useful for determining whether we’re running in production mode.
          // Most importantly, it switches React into the correct mode.
          NODE_ENV,
          // Useful for resolving the correct path to static assets in `public`.
          // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
          // This should only be used as an escape hatch. Normally you would put
          // images into the `src` and `import` them in code to get their paths.
          PUBLIC_URL: process.env.PUBLIC_URL || '/',
        }
      );
    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
      'process.env': Object.keys(raw).reduce((env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      }, {}),
    };

    return { raw, stringified };
  });
};
