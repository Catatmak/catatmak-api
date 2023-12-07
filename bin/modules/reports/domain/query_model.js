const joi = require('joi');

const getWithDate = joi.object({
  date: joi.string().valid('today', 'weekly', 'monthly', 'custom').required(),
  type: joi.string().valid('income', 'outcome').optional(),
  startDate: joi.string().optional().allow(''),
  endDate: joi.string().optional().allow(''),
});

module.exports = {
  getWithDate,
};

