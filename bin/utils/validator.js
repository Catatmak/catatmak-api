const joi = require('joi');
const validate = require('validate.js');
const wrapper = require('./wrapper');
const {BadRequestError} = require('./error');

const isValidPayload = (payload, constraint) => {
  const {value, error} = joi.validate(payload, constraint);
  if (!validate.isEmpty(error)) {
    // eslint-disable-next-line max-len
    return wrapper.error(new BadRequestError(error.details[0].message), 'payload is not valid', 400);
  }
  return wrapper.data(value, 'success', 200);
};


module.exports = {
  isValidPayload,
};
