const joi = require('joi');

const pagination = joi.object({
  finished: joi.number().optional(),
  reading: joi.number().optional(),
  name: joi.string().optional().allow(''),
});

const id = joi.object({
  id: joi.string().required(),
});

const getAllQuery = joi.object({
  page: joi.number().optional().allow(''),
  size: joi.number().optional().allow(''),
  startDate: joi.string().optional().allow(''),
  endDate: joi.string().optional().allow(''),
  type: joi.string().optional().allow(''),
});

const getWithType = joi.object({
  type: joi.string().valid('income', 'outcome').required(),
});

module.exports = {
  pagination,
  id,
  getAllQuery,
  getWithType,
};

