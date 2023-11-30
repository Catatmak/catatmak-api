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

module.exports = {
  createBookModel,
  updateBookModel,
};

