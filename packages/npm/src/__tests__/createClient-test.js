/**
 * @jest-environment node
 */

'use strict';

const { createFsFromVolume, Volume } = require('memfs');

describe('createClient', () => {
  let mockPackageJson;
  let mockVol;
  let mockFs;
  let createClient;
  let cwd;

  beforeEach(() => {
    jest.resetModules();
    mockPackageJson = {
      name: 'project',
    };
    mockVol = Volume.fromJSON({
      '/project/package.json': JSON.stringify(mockPackageJson),
      '/workspace/package.json': JSON.stringify({
        name: 'workspace',
        private: true,
        workspaces: ['packages/*'],
      }),
      '/workspace-nested/package.json': JSON.stringify({
        name: 'workspace',
        private: true,
        workspaces: {
          packages: ['packages/*'],
        },
      }),
    });
    mockFs = createFsFromVolume(mockVol);
    jest.mock('fs', () => mockFs);
    createClient = require('../createClient');
    cwd = '/project';
  });

  it('should return an error if an unsupported client type is given', async () => {
    expect(await createClient('foobar', cwd)).toEqual(
      expect.objectContaining({
        error: expect.any(Error),
      })
    );
  });

  describe.each([
    ['npm', 'install', 'npm run', '--save', '--save-dev'],
    ['yarn', 'add', 'yarn', null, '--dev'],
  ])('%s', (npmClient, installCommand, runCommand, saveFlag, saveDevFlag) => {
    let client;

    beforeAll(async () => {
      client = await createClient(npmClient, cwd);
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
  });
});
