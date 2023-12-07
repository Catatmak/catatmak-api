const joi = require('joi');

const createBookModel = joi.object({
  name: joi.string().required().error((errors) => {
    errors.forEach((err) => {
      switch (err.type) {
        case 'any.required':
          err.message = 'Gagal menambahkan buku. Mohon isi nama buku';
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  year: joi.number().required(),
  author: joi.string().required(),
  summary: joi.string().required(),
  publisher: joi.string().required(),
  pageCount: joi.number().required(),
  readPage: joi.number().required(),
  reading: joi.boolean().required(),
});

const updateBookModel = joi.object({
  bookId: joi.string().optional(),
  name: joi.string().required().error((errors) => {
    errors.forEach((err) => {
      switch (err.type) {
        case 'any.required':
          err.message = 'Gagal memperbarui buku. Mohon isi nama buku';
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  year: joi.number().optional(),
  author: joi.string().optional(),
  summary: joi.string().optional(),
  publisher: joi.string().optional(),
  pageCount: joi.number().optional(),
  readPage: joi.number().optional(),
  reading: joi.boolean().optional(),
});

const createFinancialModel = joi.object({
  title: joi.string().required(),
  type: joi.string().required(),
  price: joi.string().required(),
  category: joi.string().required(),
  created_at: joi.date().required(),
});

const updateFinancialModel = joi.object({
  id: joi.string().required(),
  title: joi.string().optional(),
  type: joi.string().optional(),
  price: joi.string().optional(),
  category: joi.string().optional(),
  created_at: joi.date().optional(),
});

const updateFinancialBulkModel = joi.array().items(updateFinancialModel);

module.exports = {
  createBookModel,
  updateBookModel,
  createFinancialModel,
  updateFinancialModel,
  updateFinancialBulkModel,
};

