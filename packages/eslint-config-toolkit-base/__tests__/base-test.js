/**
 * @jest-environment node
 */

'use strict';

const path = require('path');

describe('eslint-config-toolkit-base', () => {
  let CLIEngine;

  beforeEach(() => {
    CLIEngine = require('eslint').CLIEngine;
  });

  it('should be able to parse source text with our defined rules', () => {
    const cli = new CLIEngine({
      configFile: path.resolve(__dirname, '../.eslintrc'),
      useEslintrc: false,
    });

    const report = cli.executeOnText('var foo');

    expect(report.results).toBeDefined();
    expect(report.errorCount).not.toBe(0);
  });
});
