/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const books = require('../../../data/books');
const {BadRequestError} = require('../../../utils/error');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');
const helpers = require('../../../utils/helpers');

class GetClass {
  async getAllFinancials(payload) {
    try {
      const {startDate, endDate, type} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const pipeline = [];

      if (startDate || endDate) {
        const setDate = new Date(startDate);
        let targetDate = new Date(endDate);

        setDate.setHours(setDate.getHours() - 7);

        if (endDate) {
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(targetDate.getHours() - 7);
        } else {
          targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setUTCHours(17, 0, 0, 0);
        }

        pipeline.push({
          $match: {created_at: {$gte: setDate, $lt: targetDate}},
        });
      }

      if (type) {
        pipeline.push({
          $match: {type: type},
        });
      }

      pipeline.push(
          {
            $match: {phone},
          },
          {
            $sort: {
              created_at: -1,
            },
          },
      );

      const data = await collection.aggregate(pipeline).toArray();

      if (data.length < 1) {
        return wrapper.data([], 'data not found', 200);
      }

      const result = [];

      data.map((item) => {
        result.push({
          id: item._id,
          outcome_name: decryptDataAES256Cbc(item.outcome_name),
          price: helpers.formatToRupiah(decryptDataAES256Cbc(item.price)),
          type: item.type,
          category: item.category ? item.category : 'Tidak Terkategori',
          created_at: item.created_at,
        });
      });

      return wrapper.data(result, 'success get financials', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }

  async getFinancialsTotal(payload) {
    try {
      const {startDate, endDate} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const pipeline = [];

      if (startDate || endDate) {
        const setDate = new Date(startDate);
        let targetDate = new Date(endDate);

        setDate.setHours(setDate.getHours() - 7);

        if (endDate) {
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(targetDate.getHours() - 7);
        } else {
          targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setUTCHours(17, 0, 0, 0);
        }

        pipeline.push({
          $match: {created_at: {$gte: setDate, $lt: targetDate}},
        });
      }

      pipeline.push(
          {
            $match: {phone},
          },
          {
            $sort: {
              created_at: -1,
            },
          },
      );

      const data = await collection.aggregate(pipeline).toArray();

      if (data.length < 1) {
        return wrapper.data([], 'data not found', 200);
      }

      const result = data.reduce((accumulator, item) => {
        const decryptedPrice = decryptDataAES256Cbc(item.price);

        if (item.type === 'income') {
          accumulator.total_income += parseInt(decryptedPrice);
        } else if (item.type === 'outcome') {
          accumulator.total_outcome += parseInt(decryptedPrice);
        }

        return accumulator;
      }, {total_income: 0, total_outcome: 0});

      result.total_income = helpers.formatToRupiah(result.total_income).toString();
      result.total_outcome = helpers.formatToRupiah(result.total_outcome).toString();

      return wrapper.data(result, 'success get financials total', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }

  async getBookById(payload) {
    try {
      const getData = books.filter((n) => n.id === payload.bookId)[0];
      if (!getData) {
        return wrapper.error(new BadRequestError('Buku tidak ditemukan'), 'data not found', 404);
      }

      const response = {
        book: getData,
      };

      return wrapper.data(response, 'Sukses mengambil data detail buku', 200);
    } catch (error) {
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }
}

module.exports = GetClass;
