'use strict';

const path = require('path');

const defaultConfig = {
  extends: ['stylelint-config-toolkit'],
};

module.exports = ({ api, env, options }) => {
  const logger = api.createLogger();
  const stylelintConfig = {
    ...defaultConfig,
    ...options,
  };

  api.addCommand({
    name: 'stylelint <dir>',
    description: 'Lint your css and scss files',
    async action(dir, cmd) {
      logger.trace(
        'Running stylelint command on:',
        path.resolve(dir),
        'with options:',
        cmd
      );

      const stylelint = await api.which('stylelint', {
        cwd: __dirname,
      });

      await api.spawn(stylelint, [dir], {
        stdio: 'inherit',
      });
    },
  });

  api.add(async ({ extendPackageJson, write }) => {
    await extendPackageJson(({ cliPath }) => ({
      scripts: {
        'lint:styles': `${cliPath} stylelint "**/*.{css,scss}"`,
      },
      stylelint: stylelintConfig,
    }));
  });
};
