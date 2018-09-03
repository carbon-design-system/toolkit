'use strict';

const path = require('path');

module.exports = ({ api }) => {
  api.add(async ({ copyFolder, extendPackageJson, installDependencies }) => {
    await Promise.all([
      copyFolder(path.resolve(__dirname, './config')),
      copyFolder(path.resolve(__dirname, './public')),
      copyFolder(path.resolve(__dirname, './src')),
    ]);

    await extendPackageJson(({ cliPath, npmClient, packageJson }) => ({
      ...packageJson,
      scripts: {
        ...packageJson.scripts,
        build: 'TODO',
        'ci-check': 'yarn lint && yarn test --runInBand',
        develop:
          'cross-env NODE_ENV=development nodemon -w config -w src/server src/server/index.js',

        start: 'cross-env NODE_ENV=production node src/server/index.js',
      },
    }));

    await installDependencies(['cross-env']);
  });
};
