/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {BadRequestError} = require('../../../utils/error');
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

  async deleteFinancial(payload) {
    try {
      const {id} = payload;
      const collection = payload.mongo.db.collection('financials');
      // eslint-disable-next-line new-cap
      const data = await collection.deleteOne({_id: ObjectId(id)});

      if (!data) {
        return wrapper.data(data, 'failed delete financial', 500);
      }

      return wrapper.data(data, 'success delete financial', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'failed delete financial', 500);
    }
  }

  async updateBulkFinancials(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');
      const updates = [];

      for (const financial of payload.data) {
        const {id, title, category, price, created_at, type, image_name, image_url} = financial;
        let filter = {_id: ObjectId(id), phone: phone};

        const update = {
          $set: {
            title: encyptDataAES256Cbc(title),
            price: encyptDataAES256Cbc(price),
            type: type,
            category: category,
            created_at: created_at ? created_at : new Date(),
            image_name: image_name,
            image_url: image_url,
            updated_at: created_at ? created_at : new Date(),
          },
        };

        console.log(update);

        if (!id) {
          filter = {};
        }

        updates.push(collection.updateOne(filter, update, {upsert: true}));
      }

      const results = await Promise.all(updates);

      return wrapper.data(results, 'success update financial', 201);
    } catch (error) {
      console.error(error);
      return wrapper.error(
          new BadRequestError('failed update financial'),
          'internal server error',
          500,
      );
    }
  }
}

module.exports = UpsertClass;
