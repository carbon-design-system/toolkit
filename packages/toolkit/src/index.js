'use strict';

const { load } = require('@carbon/cli-runtime');
const { logger } = require('@carbon/cli-tools');
const program = require('commander');
const packageJson = require('../package.json');
const addCommandToProgram = require('./addCommandToProgram');

const cwd = process.cwd();

async function main({ argv }) {
  logger.trace(`Loading CLI for ${cwd}`);

  const { error, api, env } = await load({ cwd });
  if (error) {
    throw error;
  }

  // prettier-ignore
  program
    .name('toolkit')
    .version(packageJson.version)
    .usage('<command> [options]');

  for (const command of api.getCommands()) {
    logger.trace(`Adding command ${command.name} to program`);
    addCommandToProgram(program, command, env.CLI_ENV);
  }

  program.parse(argv);
}

module.exports = main;
