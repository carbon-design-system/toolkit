'use strict';

const selfsigned = jest.genMockFromModule('selfsigned');

selfsigned.generate = () => ({
  private: '<private>',
  public: '<public>',
  cert: '<cert>',
  fingerprint: '<fingerprint>',
});

module.exports = selfsigned;
