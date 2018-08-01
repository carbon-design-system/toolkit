'use strict';

function linkDependency(npmClient, { cwd, stdio = 'inherit', ...rest } = {}) {
  return spawn(npmClient, ['link'], {
    cwd,
    stdio,
    ...rest,
  });
}

module.exports = {
  linkDependency,
};
