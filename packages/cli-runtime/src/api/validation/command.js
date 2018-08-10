'use strict';

const Joi = require('joi');

const schema = Joi.object()
  .keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    allowUnknownOption: Joi.boolean(),
    options: Joi.array().items(
      Joi.object().keys({
        flags: Joi.string().required(),
        description: Joi.string().required(),
        defaults: Joi.string(),
        development: Joi.boolean(),
      })
    ),
    action: Joi.func().required(),
  })
  .required();

function validate(config) {
  return Joi.validate(config, schema);
}

module.exports = {
  schema,
  validate,
};
