'use strict';

const chalk = require('chalk');
const { spawn } = require('@carbon/cli-tools');
const npmWhich = require('npm-which');
const util = require('util');

const which = util.promisify(npmWhich(__dirname));
const defaultOptions = {
  jsxBracketSameLine: true,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
};
const defaultFileGlob = '**/*.{css,js,md,scss,ts}';

module.exports = async ({ api, env, options }) => {
  const prettier = await which('prettier');
  const prettierOptions = {
    ...defaultOptions,
    ...options,
  };

  api.addCommand({
    name: 'format',
    description: 'format files in your project',
    allowUnknownOption: true,
    async action(cmd) {
      const glob = typeof cmd === 'string' ? cmd : defaultFileGlob;
      const args = [...formatOptions(prettierOptions), '--write', glob];

      // eslint-disable-next-line no-console
      console.log(chalk.grey(`prettier ${args.join(' ')}`));

      await spawn(prettier, args, {
        stdio: 'inherit',
        cwd: env.cwd,
      });
    },
  });

  api.addCommand({
    name: 'format:diff',
    description: 'determine which files have not been formatted yet',
    allowUnknownOption: true,
    async action(cmd) {
      const glob = typeof cmd === 'string' ? cmd : defaultFileGlob;
      const args = [
        ...formatOptions(prettierOptions),
        '--list-different',
        glob,
      ];

      // eslint-disable-next-line no-console
      console.log(chalk.grey(`prettier ${args.join(' ')}`));

      try {
        await spawn(prettier, args, {
          stdio: 'inherit',
          cwd: env.cwd,
        });
      } catch (error) {
        process.exit(1);
      }
    },
  });

  api.add(async ({ extendPackageJson }) => {
    await extendPackageJson(({ cliPath, packageJson }) => ({
      ...packageJson,
      scripts: {
        ...packageJson.scripts,
        format: `${cliPath} format`,
        'format:diff': `${cliPath} format:diff`,
      },
      prettier: prettierOptions,
    }));
  });
};

function splitCamelCase(string) {
  const words = [''];
  let wordPosition = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === string[i].toUpperCase()) {
      words[++wordPosition] = '';
    }
    words[wordPosition] += string[i].toLowerCase();
  }
  return words;
}

function formatOptions(options) {
  return Object.keys(options)
    .map(key => {
      const flag = splitCamelCase(key).join('-');
      const value = options[key];

      if (typeof value === 'boolean') {
        return [`--${flag}`];
      }

      return [`--${flag}`, value];
    })
    .reduce((acc, flags) => acc.concat(flags), []);
}
