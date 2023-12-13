/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');

class GetClass {
  async getMyProfile(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('users');
      const data = await collection.findOne({phone_hmac: phone});
      const response = {
        id: data._id,
        phone: decryptDataAES256Cbc(data.phone),
        name: data.name ? decryptDataAES256Cbc(data.name) : '',
        email: data.email ? decryptDataAES256Cbc(data.email) : '',
        gender: data.gender ? data.gender : '',
        age: data.age ? data.age : '',
        membership: {
          status: 'Premium Member',
          image_url: 'https://storage.googleapis.com/catatmak-public/assets/premium-member.png',
        },
      };

      return wrapper.data(response, 'success get financials', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }
}

module.exports = GetClass;
