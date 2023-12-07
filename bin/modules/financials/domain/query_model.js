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

const getWithDate = joi.object({
  date: joi.string().valid('today', 'weekly', 'monthly', 'custom').required(),
  type: joi.string().valid('income', 'outcome').optional(),
  startDate: joi.string().optional().allow(''),
  endDate: joi.string().optional().allow(''),
});

module.exports = {
  pagination,
  id,
  getAllQuery,
  getWithType,
  getWithDate,
};

