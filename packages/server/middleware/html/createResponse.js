'use strict';

const createHead = require('./createHead');
const createBody = require('./createBody');
const parseMetaTags = require('./parseMetaTags');

const createResponse = ({
  manifest,
  runtime,
  addToHead,
  getTitle,
  getMetaTags,
}) => (req, res) => {
  const lateHeadChunk = [
    getMetaTags && parseMetaTags(getMetaTags(req)),
    addToHead && addToHead(req),
  ]
    .filter(Boolean)
    .join('');
  const earlyChunk = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    createHead(manifest, runtime, lateHeadChunk, getTitle(req)),
  ].join('');

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.write(earlyChunk);
  res.flush();

  const lateChunk = [createBody(manifest), '</html>'].join('');

  res.write(lateChunk);
  res.flush();
  res.end();
};

module.exports = exports = createResponse;
