const joi = require('joi');

const updateProfile = joi.object({
  name: joi.string().optional().allow(''),
  email: joi.string().optional().allow(''),
  gender: joi.string().optional().allow(''),
  age: joi.string().optional().allow(''),
});

module.exports = {
  updateProfile,
};
