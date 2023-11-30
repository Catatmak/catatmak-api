const joi = require('joi');

const pagination = joi.object({
  finished: joi.number().optional(),
  reading: joi.number().optional(),
  name: joi.string().optional().allow(''),
});

const bookId = joi.object({
  bookId: joi.string().required(),
});

const getAllQuery = joi.object({
  page: joi.number().optional().allow(''),
  size: joi.number().optional().allow(''),
  startDate: joi.string().optional().allow(''),
  endDate: joi.string().optional().allow(''),
  type: joi.string().optional().allow(''),
});

module.exports = {
  pagination,
  bookId,
  getAllQuery,
};

