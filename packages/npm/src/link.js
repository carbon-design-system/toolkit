'use strict';

const { spawn } = require('@carbon/cli-tools');

function linkDependency(npmClient, { cwd, stdio = 'inherit', ...rest } = {}) {
  return spawn(npmClient, ['link'], {
    cwd,
    stdio,
    ...rest,
  });
}

function unlinkDependency(npmClient, { cwd, stdio = 'inherit', ...rest } = {}) {
  return spawn(npmClient, ['unlink'], {
    cwd,
    stdio,
    ...rest,
  });
}

module.exports = {
  linkDependency,
  unlinkDependency,
};
