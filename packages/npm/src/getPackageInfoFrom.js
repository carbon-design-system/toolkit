'use strict';

// some-package
// some-package@next
// @foo/some-package
// @foo/some-package@next
function getPackageInfoFrom(string) {
  if (string[0] === '@') {
    const [scope, rawName] = string.split('/');
    const { name, version } = getVersionFromString(rawName);
    return {
      name: `${scope}/${name}`,
      version,
    };
  }

  return getVersionFromString(string);
}

function getVersionFromString(string) {
  const [name, version = 'latest'] = string.split('@');
  return {
    name,
    version,
  };
}

module.exports = getPackageInfoFrom;
