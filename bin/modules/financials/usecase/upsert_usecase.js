/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {BadRequestError} = require('../../../utils/error');
const {encyptDataAES256Cbc} = require('../../../utils/crypsi');
const {ObjectId} = require('mongodb');
const moment = require('moment-timezone');

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

      return wrapper.data(data, 'Berhasil Simpan Data 😎', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(new BadRequestError('failed insert financial'), 'internal server error', 500);
    }
  }

  async updateFinancial(payload) {
    try {
      const {title, category, price, type, id} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const filter = {_id: ObjectId(id), phone: phone}; // Assuming you have an ObjectId for the document's id
      const update = {
        $set: {
          title: encyptDataAES256Cbc(title),
          price: encyptDataAES256Cbc(price),
          type: type,
          category: category,
          updated_at: new Date(),
        },
      };

      const result = await collection.updateOne(filter, update);
      if (result.modifiedCount !== 1) {
        return wrapper.error(new BadRequestError('failed update financial'), 'internal server error', 500);
      }

      return wrapper.data(result, 'Berhasil Update Data 😎', 201);
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

      return wrapper.data(data, 'Berhasil Hapus Data 😎', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'failed delete financial', 500);
    }
  }

  async updateBulkFinancials(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      for (const financial of payload.data) {
        const {id, title, category, price, type, image_name, image_url} = financial;
        const filter = {_id: ObjectId(id), phone: phone};

        const now = moment(new Date());
        const currentDate = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');


        const update = {
          $set: {
            title: encyptDataAES256Cbc(title),
            price: encyptDataAES256Cbc(price),
            type: type,
            category: category,
            image_name: image_name,
            image_url: image_url,
            created_at: new Date(currentDate),
            updated_at: new Date(currentDate),
          },
        };

        if (!id) {
          await collection.insertOne({
            phone: phone,
            title: encyptDataAES256Cbc(title),
            price: encyptDataAES256Cbc(price),
            type: type,
            category: category,
            image_name: image_name,
            image_url: image_url,
            created_at: new Date(currentDate),
            updated_at: new Date(currentDate),
          });
        } else {
          await collection.updateOne(filter, update, {upsert: true});
        }
      }


      return wrapper.data({}, 'Berhasil Simpan Data 😎', 201);
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
