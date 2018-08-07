'use strict';

const { load } = require('@carbon/cli-runtime');
const { logger } = require('@carbon/cli-tools');
const program = require('commander');
const packageJson = require('../package.json');

const cwd = process.cwd();

async function main({ argv }) {
  logger.trace(`Loading CLI for ${cwd}`);

  const { error } = await load({ cwd });
  if (error) {
    throw error;
  }

  // prettier-ignore
  program
    .name('toolkit')
    .version(packageJson.version)
    .usage('<command> [options]');

  program.parse(argv);
}

module.exports = main;
