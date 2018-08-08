'use strict';

const formatErrorMessage = error => {
  const { title = 'Internal Server Error.', status = 500, details } = error;
  return {
    status,
    title,
    details,
  };
};

const formatErrorResponse = errors => ({
  errors: errors.map(formatErrorMessage),
});

module.exports = exports = formatErrorResponse;
exports.formatErrorMessage = formatErrorMessage;
