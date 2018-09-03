'use strict';

module.exports = ({ api }) => {
  api.add(async ({ installDependencies }) => {
    await installDependencies([
      'cross-env',
      'dotenv',
      'express',
      'nodemon',
      'react',
      'react-dom',
      'prop-types',
    ]);
  });
};
