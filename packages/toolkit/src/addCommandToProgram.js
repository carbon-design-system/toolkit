'use strict';

const { ConsoleReporter } = require('@carbon/cli-reporter');
const { logger } = require('@carbon/cli-tools');
const packageJson = require('../package.json');

// Initialize our reporter for the console. Used for logging messages
const reporter = new ConsoleReporter();

/**
 * @typedef Option
 * @param {string} flags - specify the flags for the option
 * @param {string} description - the description to show for the option
 * @param {any} defaults - the default value for the option
 */

/**
 * @typedef Command
 * @param {string} name - the name of the command
 * @param {string} description - the description to show for the command
 * @param {Option[]} options - available options for the command
 * @param {Function} action - the function to call when the command is run
 */

/**
 * Add the given command to the program
 *
 * @param {Object} program - the program instance, usually from Commander.js
 * @param {Command} command - the command to add to the program
 * @param {string} CLI_ENV - the current environment for the CLI
 */
function addCommandToProgram(program, command, CLI_ENV) {
  // Add our validated command to the given `program`. As a note, there may be
  // other options on this object that should be forwarded to commander. These
  // values should be captured under `rest`.
  const { name, description, options = [], action, ...rest } = command;
  const cliCommand = program.command(name).description(description);

  // Iterate through our available options and add them to the cli command. We
  // also use this as a chance to dynamically add development-only options to
  // the CLI if we're in a development environment.
  for (const option of options) {
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

  // Invoke any of our unknown options on the given cli command
  for (const key of Object.keys(rest)) {
    if (cliCommand[key]) {
      cliCommand[key]();
    }
  }

  // Wrap the action for the cli command so that we can decorate it with some
  // helpful information, in addition to catching any unexpected errors at
  // runtime.
  cliCommand.action(async (...args) => {
    const start = Date.now();
    const commandArgs = args.slice(0, args.length - 1);
    const options = cleanArgs(args[args.length - 1]);

    logger.trace(
      'Running command:',
      name,
      'with args:',
      commandArgs,
      'and options:',
      options
    );

    try {
      reporter.header(`${packageJson.name} ${name}`);
      await action(...commandArgs, options);
      reporter.log(`🎉 Done in ${(Date.now() - start) / 1000}s`);
    } catch (error) {
      if (error instanceof ReferenceError) {
        reporter.error('Runtime error occurred');
        reporter.info(
          'This is totally our fault, looks like we wrote some code that has ' +
            'a couple of bugs in it.'
        );
        reporter.info(
          `Please file an issue at ${
            packageJson.bugs
          } with the following stack trace:`
        );
        reporter.stack(error);
        return;
      }

      reporter.error('Unexpected error occurred');
      reporter.info(
        'Yikes, looks like something went wrong while running this command. ' +
          'Here is some information you can use to try and fix it:'
      );
      reporter.stack(error);
      reporter.info(
        `If this information doesn't help, please create an issue at: ` +
          `${packageJson.bugs} with the information above.`
      );

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
