'use strict';

const build = require('./build');

module.exports = ({ api }) => {
  const paths = api.read('paths');

  api.addCommand({
    name: 'build',
    description: 'build your application files using webpack',
    action() {
      const getConfig = api.read('webpack.config.production');
      return build(paths, getConfig());
    },
  });

  api.add(async ({ extendPackageJson }) => {
    await extendPackageJson(({ cliPath }) => ({
      scripts: {
        build: `cross-env NODE_ENV=production ${cliPath} build`,
      },
    }));
  });

  api.extend('webpack.config.production', () => {
    const babel = api.read('babel');
    return () => require('./production')(paths, babel);
  });
};
