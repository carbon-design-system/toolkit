'use strict';

const path = require('path');

const defaultConfig = {
  extends: ['eslint-config-toolkit'],
};

module.exports = ({ api, env, options }) => {
  const eslintConfig = {
    ...defaultConfig,
    ...options,
  };

  api.addCommand({
    name: 'lint <dir>',
    description: 'Lint your application files',
    allowUnknownOption: true,
    async action(dir, cmd) {
      // eslint-disable-next-line no-console
      console.log('Linting:', dir, 'with:', cmd);
      // eslint-disable-next-line no-console
      console.log(path.resolve(dir));
    },
  });

  api.add(({ extendPackageJson, write }) =>
    Promise.all([
      extendPackageJson(({ cliPath }) => ({
        scripts: {
          eslint: `${cliPath} lint .`,
        },
        eslintConfig,
      })),
      write(
        '.eslintignore',
        ['cjs', 'es', 'lib', 'node_modules', 'umd'].join('\n')
      ),
    ])
  );
};
