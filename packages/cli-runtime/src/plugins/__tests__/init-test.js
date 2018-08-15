/**
 * @jest-environment node
 */

'use strict';

const { createFsFromVolume, Volume } = require('memfs');

function getCommandByName(commands, name) {
  return commands.find(command => command.name.includes(name));
}

function stringify(object) {
  return JSON.stringify(object, null, 2);
}

describe('init', () => {
  let mockVol;
  let mockFs;
  let mockCommands;
  let mockPluginAPI;
  let mockEnv;

  beforeEach(() => {
    jest.resetModules();

    mockVol = Volume.fromJSON({
      '/empty': null,
      '/exists/package.json': '{ "name": "exists" }',
      '/exists-with-toolkit/package.json': stringify({
        name: 'exists-with-toolkit',
        dependencies: {
          '@carbon/cli-plugin-env': '0.0.0',
          '@carbon/toolkit': '0.0.0',
        },
        toolkit: {
          plugins: ['@carbon/cli-plugin-env'],
        },
      }),
    });
    mockFs = createFsFromVolume(mockVol);
    mockCommands = [];
    mockPluginAPI = {
      addCommand: jest.fn(command => {
        mockCommands.push(command);
      }),
      createLogger: jest.fn(() => ({
        trace: jest.fn(),
      })),
      clearConsole: jest.fn(),
    };
    mockEnv = {
      cwd: '/',
      npmClient: 'npm',
    };

    jest.mock('fs', () => mockFs);
    jest.mock('@carbon/npm');
    jest.mock('../init/display', () => ({
      displaySuccess: jest.fn(),
    }));
  });

  describe('commands', () => {
    let plugin;

    beforeEach(() => {
      plugin = require('../init');
    });

    it('should register an init command with the api', async () => {
      await plugin({ api: mockPluginAPI, env: mockEnv });

      expect(mockPluginAPI.addCommand).toHaveBeenCalledTimes(1);

      const command = getCommandByName(mockCommands, 'init');
      expect(command).toBeDefined();
    });
  });

  describe('with invalid project setup', () => {
    let plugin;

    beforeEach(() => {
      plugin = require('../init');
    });

    it('should throw if no package.json file is available', async () => {
      await plugin({
        api: mockPluginAPI,
        env: {
          ...mockEnv,
          cwd: '/empty',
        },
      });
      const command = getCommandByName(mockCommands, 'init');

      return expect(command.action({ skip: true })).rejects.toThrow();
    });

    it('should throw if a package.json file is available but toolkit is found', async () => {
      await plugin({
        api: mockPluginAPI,
        env: {
          ...mockEnv,
          cwd: '/exists-with-toolkit',
        },
      });
      const command = getCommandByName(mockCommands, 'init');

      return expect(command.action({ skip: true })).rejects.toThrow();
    });
  });

  describe('with project package.json', () => {
    let fs;
    let plugin;
    let createClient;

    beforeEach(() => {
      createClient = require('@carbon/npm').createClient;
      fs = require('fs-extra');
      plugin = require('../init');
    });

    it('should install `@carbon/toolkit`', async () => {
      await plugin({
        api: mockPluginAPI,
        env: {
          ...mockEnv,
          cwd: '/exists',
        },
      });
      const command = getCommandByName(mockCommands, 'init');
      await command.action({ skip: true });

      expect(createClient.mock.installDependencies[0]).toHaveBeenCalledWith([
        '@carbon/toolkit',
      ]);
    });

    it('should write a "toolkit" field', async () => {
      await plugin({
        api: mockPluginAPI,
        env: {
          ...mockEnv,
          cwd: '/exists',
        },
      });
      const command = getCommandByName(mockCommands, 'init');
      await command.action({ skip: true });

      expect(await fs.readJson('/exists/package.json')).toEqual(
        expect.objectContaining({
          toolkit: {
            plugins: [],
          },
        })
      );
    });
  });
});
