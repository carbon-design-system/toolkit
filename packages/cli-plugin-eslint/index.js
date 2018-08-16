'use strict';

const path = require('path');

const defaultConfig = {
  extends: ['eslint-config-toolkit'],
};

module.exports = ({ api, options }) => {
  const eslintConfig = {
    ...defaultConfig,
    ...options,
  };
  const logger = api.createLogger();

  api.addCommand({
    name: 'lint <dir>',
    description: 'Lint your application files',
    allowUnknownOption: true,
    async action(dir, cmd) {
      logger.trace(
        'Running lint command on:',
        path.resolve(dir),
        'with options:',
        cmd
      );

      const eslint = await api.which('eslint', {
        cwd: __dirname,
      });

      await api.spawn(eslint, [dir], {
        stdio: 'inherit',
      });
    },
  });

  api.add(({ extendPackageJson, write }) => {
    return Promise.all([
      extendPackageJson(({ cliPath }) => ({
        scripts: {
          lint: `${cliPath} lint .`,
        },
        eslintConfig,
      })),
      write(
        '.eslintignore',
        ['cjs', 'es', 'lib', 'node_modules', 'umd'].join('\n')
      ),
    ]);
  });
};
