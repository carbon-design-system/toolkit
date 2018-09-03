'use strict';

module.exports = ({ api }) => {
  api.add(async ({ installDependencies }) => {
    await installDependencies(['react', 'react-dom', 'prop-types']);
  });
};
