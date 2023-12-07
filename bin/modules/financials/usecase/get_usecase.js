/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');
const helpers = require('../../../utils/helpers');
const {ObjectId} = require('mongodb');

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
          title: decryptDataAES256Cbc(item.title),
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
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const dataOfMonth = await collection.aggregate([
        {
          $match: {
            phone: phone,
            created_at: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
      ]).toArray();

      const result = dataOfMonth.reduce((accumulator, item) => {
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
      return wrapper.data(error, 'failed get financials total', 500);
    }
  }

  async getFinancialById(payload) {
    try {
      const {id} = payload;
      const collection = payload.mongo.db.collection('financials');
      // eslint-disable-next-line new-cap
      const data = await collection.findOne({_id: ObjectId(id)});

      if (!data) {
        return wrapper.error(true, 'failed get detail financial', 500);
      }

      return wrapper.data(data, 'success get detail financial', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'failed get detail financial', 500);
    }
  }

  async getFinancialsSummary(payload) {
    const {phone} = payload.auth.credentials;
    const {type} = payload;
    const collection = payload.mongo.db.collection('financials');

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const data = await collection.aggregate([
      {
        $match: {
          phone: phone,
          type: type,
          created_at: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
    ]).toArray();

    for (let index = 0; index < data.length; index++) {
      data[index].price = decryptDataAES256Cbc(data[index].price);
    }

    const response = {
      total_today: 0,
      total_weekly: 0,
      total_monthly: 0,
    };

    // Calculate totals
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    data.forEach((item) => {
      const itemDate = new Date(item.created_at);
      // Check if the item is from today
      if (itemDate.toDateString() === today.toDateString()) {
        response.total_today += parseInt(item.price);
      }

      // Check if the item is from this week
      if (itemDate >= startOfWeek) {
        response.total_weekly += parseInt(item.price);
      }

      // Check if the item is from this month
      if (itemDate >= startOfMonth) {
        response.total_monthly += parseInt(item.price);
      }
    });

    // Assuming you want to format the totals as currency
    response.total_today = helpers.formatToRupiah(response.total_today);
    response.total_weekly = helpers.formatToRupiah(response.total_weekly);
    response.total_monthly = helpers.formatToRupiah(response.total_monthly);

    return wrapper.data(response, `success get financials ${type} summary`, 200);
  }
}

module.exports = GetClass;
