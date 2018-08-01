/**
 * @jest-environment node
 */

'use strict';

describe('createClient', () => {
  let createClient;
  let cwd;

  beforeEach(() => {
    createClient = require('../createClient');
    cwd = '/';
  });

  it('should return an error if an unsupported client type is given', () => {
    expect(createClient('foobar', cwd)).toEqual(
      expect.objectContaining({
        error: expect.any(Error),
      })
    );
  });

  const cases = [
    ['npm', 'install', 'npm run', '--save', '--save-dev'],
    ['yarn', 'add', 'yarn', null, '--dev'],
  ];

  describe.each(cases)(
    '%s',
    (npmClient, installCommand, runCommand, saveFlag, saveDevFlag) => {
      let client;

      beforeAll(() => {
        client = createClient(npmClient, cwd);
      });

      it('should specify the correct install command', () => {
        expect(client.installCommand).toBe(installCommand);
      });

      it('should specify the correct run command', () => {
        expect(client.runCommand).toBe(runCommand);
      });

      it('should specify the correct save flag', () => {
        expect(client.saveFlag).toBe(saveFlag);
      });

      it('should specify the correct save dev flag', () => {
        expect(client.saveDevFlag).toBe(saveDevFlag);
      });
    }
  );
});
