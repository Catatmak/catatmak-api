/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');
const axios = require('axios');

class GetClass {
  async getTotalUncategorized(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');
      const data = await collection.countDocuments({
        phone: phone,
        $or: [
          {category: ''},
          {category: null},
          {category: {$exists: false}},
        ],
      });

      if (!data) {
        return wrapper.data({count: 0}, 'success get total uncategorize', 200);
      }

      return wrapper.data({count: data}, 'success get total uncategorize', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data({count: 0}, 'failed get total uncategorize', 500);
    }
  }

  async getFinancialsUncategorized(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');
      const data = await collection.find({
        phone: phone,
        $or: [
          {category: ''},
          {category: null},
          {category: {$exists: false}},
        ],
      }).toArray();

      const response = [];
      const listTitle = [];
      let listCategory = [];

      if (!data) {
        return wrapper.data(response, 'success get total uncategorize', 200);
      }

      data.map((item) => {
        listTitle.push(decryptDataAES256Cbc(item.title));
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

      const body = {
        nama: listTitle,
      };


      // fetch to ml api
      const config = {
        method: 'post',
        url: 'https://catatmak-ml-api-lbiuaop2oq-et.a.run.app/categorize',
        data: body,
      };

      const mlData = await axios.request(config);
      listCategory = mlData.data.predicted_categories;

      for (let index = 0; index < response.length; index++) {
        response[index].category = listCategory[index] ?? 'Lainnya';
      }

      return wrapper.data(response, 'success get uncategorize', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data([], 'failed get uncategorize', 500);
    }
  }
}

module.exports = GetClass;
