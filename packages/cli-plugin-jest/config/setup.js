'use strict';

require('../polyfills');

global.requestAnimationFrame = function requestAnimationFrame(callback) {
  setTimeout(callback);
};
