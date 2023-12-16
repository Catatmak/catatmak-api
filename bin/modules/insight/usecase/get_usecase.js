/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');
const axios = require('axios');
const {startOfWeek, endOfWeek, format} = require('date-fns');
const helpers = require('../../../utils/helpers');
const {id} = require('date-fns/locale'); // Make sure you have the locale data for 'id' installed

class GetClass {
  async getInsight(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');
      const startOfLastWeek = startOfWeek(new Date());
      const endOfLastWeek = endOfWeek(new Date());

      const startOfLastWeekFormatted = format(startOfLastWeek, 'EEEE, d MMMM yyyy', {locale: id});
      const endOfLastWeekFormatted = format(endOfLastWeek, 'EEEE, d MMMM yyyy', {locale: id});

      const response = [];

      const data = await collection.find({
        phone: phone,
        created_at: {
          $gte: startOfLastWeek,
          $lt: endOfLastWeek,
        },
      }).sort({created_at: -1}).toArray();

      if (!data) {
        return wrapper.data(response, 'success get total uncategorize', 200);
      }

      data.map((item) => {
        response.push({
          id: item._id,
          title: decryptDataAES256Cbc(item.title),
          price: decryptDataAES256Cbc(item.price),
          type: item.type,
          category: item.category,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      });

      // fetch to ml api
      const config = {
        method: 'post',
        url: 'https://catatmak-ml-api-lbiuaop2oq-et.a.run.app/insight',
        data: response,
      };

      const mlData = await axios.request(config);

      const responseData = mlData.data;
      if (!response) {
        return wrapper.data([], 'success get insight', 200);
      }

      const insights = [
        helpers.wordingTotalExpensesInWeek(startOfLastWeekFormatted, endOfLastWeekFormatted, helpers.formatToRupiah(responseData.total_expenses_last_week)),
        helpers.wordingMostCategories(responseData.most_expensive_category, helpers.formatToRupiah(responseData.total_expenses_most_category)),
        helpers.wordingDayMostExpenses(responseData.date_most_expenses, helpers.formatToRupiah(responseData.total_expenses_on_day_most_expenses)),
        helpers.wordingPrediction(responseData.conclusion, helpers.formatToRupiah(responseData.total_predicted_expenses)),
      ].filter((n) => n);

      return wrapper.data(helpers.shuffle(insights), 'success get insight', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data({count: 0}, 'failed get insight', 500);
    }
  }
}

module.exports = GetClass;
