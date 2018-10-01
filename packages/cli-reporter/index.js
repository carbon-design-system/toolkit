'use strict';

const chalk = require('chalk');

// Fix bold on Windows
// Reference: https://github.com/yarnpkg/yarn/blob/ed2c8a50c02505bdd6bd67d5e8c4461abc2b8dae/src/reporters/console/console-reporter.js#L32-L35
if (
  process.platform === 'win32' &&
  !(process.env.TERM && /^xterm/i.test(process.env.TERM))
) {
  chalk.bold._styles[0].close += '\u001b[m';
}

class ConsoleReporter {
  constructor({
    stderr = process.stderr,
    stdin = process.stdin,
    stdout = process.stdout,
  } = {}) {
    this.format = chalk;
    this.stderr = stderr;
    this.stdin = stdin;
    this.stdout = stdout;
  }

  error(message) {
    this._logCategory('error', 'red', message);
  }

  header(message) {
    this.log(this.format.bold(message));
  }

  info(message) {
    this._logCategory('info', 'blue', message);
  }

  log(message = '') {
    this.stdout.write(`${message}\n`);
  }

  stack(error) {
    this.stdout.write(`\n${error.stack}\n\n`);
  }

  success(message) {
    this._logCategory('success', 'green', message);
  }

  _logCategory(category, color, message) {
    this.log(`${this.format[color](category)} ${message}`);
  }
}

module.exports = {
  ConsoleReporter,
};
