/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {BadRequestError} = require('../../../utils/error');
const books = require('../../../data/books');
const {encyptDataAES256Cbc} = require('../../../utils/crypsi');
const {ObjectId} = require('mongodb');
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

  async updateFinancial(payload) {
    try {
      const {title, category, price, created_at, type, id} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const filter = {_id: ObjectId(id), phone: phone}; // Assuming you have an ObjectId for the document's id
      const update = {
        $set: {
          title: encyptDataAES256Cbc(title),
          price: encyptDataAES256Cbc(price),
          type: type,
          category: category,
          created_at: created_at,
          updated_at: created_at ? created_at : new Date(),
        },
      };

      const result = await collection.updateOne(filter, update);
      if (result.modifiedCount !== 1) {
        return wrapper.error(new BadRequestError('failed update financial'), 'internal server error', 500);
      }

      return wrapper.data(result, 'success update financial', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(new BadRequestError('failed update financial'), 'internal server error', 500);
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
