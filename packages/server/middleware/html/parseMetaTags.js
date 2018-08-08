'use strict';

function format(object, prefix = '') {
  return Object.keys(object).reduce((acc, key) => {
    if (typeof object[key] === 'object') {
      return {
        ...acc,
        ...format(object[key], key),
      };
    }
    const prefixedKey = prefix !== '' ? `${prefix}:${key}` : key;

    return {
      ...acc,
      [prefixedKey]: object[key],
    };
  }, {});
}

function parseMetaTags(object) {
  const formattedTags = format(object);
  const metaTags = Object.keys(formattedTags).map(
    key => `<meta property="${key}" content="${formattedTags[key]}">`
  );
  return metaTags.join('');
}

module.exports = parseMetaTags;
