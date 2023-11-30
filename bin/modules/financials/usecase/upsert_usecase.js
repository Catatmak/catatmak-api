/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {BadRequestError} = require('../../../utils/error');
const books = require('../../../data/books');
const {encyptDataAES256Cbc} = require('../../../utils/crypsi');

class UpsertClass {
  async createFinancial(payload) {
    try {
      const {title, category, price, created_at, type} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const model = {
        phone: phone,
        title: encyptDataAES256Cbc(title),
        price: encyptDataAES256Cbc(price),
        type: type,
        category: category,
        created_at: created_at,
        updated_at: created_at,
      };

      const data = await collection.insertOne(model);

      if (!data) {
        return wrapper.error(new BadRequestError('failed insert financial'), 'internal server error', 500);
      }

      return wrapper.data(data, 'success insert financial', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(new BadRequestError('failed insert financial'), 'internal server error', 500);
    }
  }

  async updateBook(payload) {
    try {
      const index = books.findIndex((book) => book.id === payload.bookId);

      if (index == -1) {
        return wrapper.error(new BadRequestError('Gagal memperbarui buku. Id tidak ditemukan'), 'data not found', 404);
      }

      if (payload.readPage > payload.pageCount) {
        return wrapper.error(new BadRequestError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'), 'payload is not valid', 400);
      }

      books[index].name = payload.name;
      books[index].year = payload.year;
      books[index].author = payload.author;
      books[index].summary = payload.summary;
      books[index].publisher = payload.publisher;
      books[index].pageCount = payload.pageCount;
      books[index].readPage = payload.readPage;
      books[index].reading = payload.reading;
      books[index].updatedAt = new Date().toISOString();

      if (payload.pageCount == payload.readPage) {
        books[index].finished = true;
      }

      return wrapper.data('', 'Buku berhasil diperbarui', 200);
    } catch (error) {
      return wrapper.data(error, 'Gagal memperbarui buku catch', 500);
    }
  }

  async deleteBook(payload) {
    try {
      const index = books.findIndex((book) => book.id === payload.bookId);

      if (index == -1) {
        return wrapper.error(new BadRequestError('Buku gagal dihapus. Id tidak ditemukan'), 'data not found', 404);
      }

      books.splice(index, 1);

      return wrapper.data('', 'Buku berhasil dihapus', 200);
    } catch (error) {
      return wrapper.data(error, 'Buku gagal dihapus', 500);
    }
  }
}

module.exports = UpsertClass;
