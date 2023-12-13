/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {encyptDataAES256Cbc} = require('../../../utils/crypsi');

class UpsertClass {
  async updateProfile(payload) {
    try {
      const collection = payload.mongo.db.collection('users');
      const {name, email, gender, age} = payload;
      const {phone} = payload.auth.credentials;

      const filter = {phone_hmac: phone}; // Assuming you have an ObjectId for the document's id
      const update = {
        $set: {
          name: encyptDataAES256Cbc(name),
          email: encyptDataAES256Cbc(email),
          gender: gender,
          age: age,
          updated_at: new Date(),
        },
      };

      const result = await collection.updateOne(filter, update);
      if (result.modifiedCount !== 1) {
        return wrapper.error(new BadRequestError('failed update financial'), 'internal server error', 500);
      }

      return wrapper.data(result, 'success update users', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(error, 'internal server error', 500);
    }
  }
}

module.exports = UpsertClass;
