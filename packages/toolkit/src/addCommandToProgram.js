'use strict';

const { logger } = require('@carbon/cli-tools');

function addCommandToProgram(program, command, CLI_ENV) {
  const { name, description, options = [], action, ...rest } = command;
  const cliCommand = program.command(name).description(description);

  for (let option of options) {
    const { flags, description, defaults, development } = option;

    if (development) {
      if (CLI_ENV === 'development') {
        const args = [flags, `${description} [DEV ONLY]`, defaults].filter(
          Boolean
        );
        cliCommand.option(...args);
      }
    } else {
      const args = [flags, description, defaults].filter(Boolean);
      cliCommand.option(...args);
    }
  }

  for (let key of Object.keys(rest)) {
    if (cliCommand[key]) {
      cliCommand[key]();
    }
  }

  cliCommand.action(async (...args) => {
    const commandArgs = args.slice(0, args.length - 1);
    const command = args[args.length - 1];
    const options = cleanArgs(command);

    logger.trace(
      'Running command:',
      name,
      'with args:',
      commandArgs,
      'and options:',
      options
    );

    try {
      await action(...commandArgs, options);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
}

// Inspired by Vue CLI:
// https://github.com/vuejs/vue-cli/blob/31e1b4995edef3d2079da654deedffe002a1d689/packages/%40vue/cli/bin/vue.js#L172
function cleanArgs(command) {
  return command.options.reduce((acc, option) => {
    // TODO: add case for reserved words from commander, like options

    // Add case for mapping `--foo-bar` to `fooBar`
    const key = option.long
      .replace(/^--/, '')
      .split('-')
      .map((word, i) => {
        if (i === 0) {
          return word;
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join('');

    // If an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof command[key] !== 'function') {
      return {
        ...acc,
        [key]: command[key],
      };
    }
    return acc;
  }, {});
}

module.exports = addCommandToProgram;
