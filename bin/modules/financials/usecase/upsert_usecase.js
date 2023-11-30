/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {BadRequestError} = require('../../../utils/error');
const {nanoid} = require('nanoid');
const books = require('../../../data/books');

class UpsertClass {
  async createBook(payload) {
    try {
      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      let finished = false;

      if (payload.pageCount == payload.readPage) {
        finished = true;
      }

      if (payload.readPage > payload.pageCount) {
        return wrapper.error(new BadRequestError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'), 'payload is not valid', 400);
      }

      const newData = {
        id: id,
        ...payload,
        finished: finished,
        insertedAt: insertedAt,
        updatedAt: updatedAt,
      };

      books.push(newData);

      const response = {
        bookId: newData.id,
      };

      return wrapper.data(response, 'Buku berhasil ditambahkan', 201);
    } catch (error) {
      return wrapper.error(new BadRequestError('Buku gagal ditambahkan'), 'Internal server error', 500);
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
