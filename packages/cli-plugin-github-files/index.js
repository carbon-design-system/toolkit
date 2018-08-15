'use strict';

const path = require('path');
const files = path.join(__dirname, 'files');

module.exports = ({ api }) => {
  api.add(({ copyFolder }) => copyFolder(files, '.github'));
};
