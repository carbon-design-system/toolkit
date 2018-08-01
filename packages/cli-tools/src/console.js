'use strict';

/**
 * Copied from Facebook's Create React App:
 * https://github.com/facebook/create-react-app/blob/19e0bb1881e24fb1ee3fe421413d4d87e67f68dd/packages/react-dev-utils/clearConsole.js
 */
function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

module.exports = {
  clearConsole,
};
