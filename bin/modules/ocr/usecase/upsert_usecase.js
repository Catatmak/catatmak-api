/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const fs = require('fs');
const gconfig = require('../../../config/gcloud.json');

class UpsertClass {
  async processOCR(payload) {
    try {
      const {file} = payload;
      const mindeeClc = payload.mongo.db.collection('mindee');
      const mindeeAPIKey = mindeeClc.findOne({}).sort({limit: -1}).toArray();

      console.log(mindeeAPIKey);

      const storage = new Storage({
        keyFilename: gconfig, // Replace with your service account key file
        projectId: 'catatmak',
      });

      const fileContent = fs.readFileSync(file.path);
      const destinationFileName = `images/${file.filename}`;
      const uploadStorage = await storage.bucket('catatmak-private').upload(file.path, {
        destination: destinationFileName,
      });

      if (!uploadStorage) {
        return wrapper.error(new BadRequestError('failed insert financial'), 'internal server error', 500);
      }

      console.log(uploadStorage)

      fs.unlinkSync(file.path);

      const mindeeApiResponse = await axios.post(
          mindeeApiEndpoint,
          fileContent,
          {
            headers: {
              'Content-Type': 'image/jpeg', // Adjust the content type based on your image type
              'Authorization': `Bearer ${mindeeAPIKey}`,
            },
          },
      );

      if (mindeeApiResponse) {
        // do upsert to minus limit here
      }

      // do modeling responses

      console.log('Mindee API Response:', mindeeApiResponse.data);


      return wrapper.data(mindeeApiResponse.data, 'success insert financial', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(new BadRequestError('failed insert financial'), 'internal server error', 500);
    }
  }
}

module.exports = UpsertClass;
