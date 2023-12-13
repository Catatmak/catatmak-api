/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const fs = require('fs');
const path = require('path');
const {Storage} = require('@google-cloud/storage');
const mindee = require('mindee');

class UpsertClass {
  async processOCR(payload) {
    try {
      const {file} = payload.payload;
      const mindeeClc = payload.mongo.db.collection('mindee');
      const mindeeData = await mindeeClc.find({}).sort({limit: -1}).toArray();
      let mindeeApi = '';

      if (!mindeeData) {
        return wrapper.error(new BadRequestError('mindee api key is not found'), 'mindee api key is not found', 500);
      }

      if (mindeeData?.length > 0) {
        mindeeApi = mindeeData[0].apiKey;
      }

      const storage = new Storage({
        keyFilename: path.join(__dirname, '../../../config/gcloud.json'),
        projectId: 'catatmak',
      });

      const destinationFileName = `images/${file.filename}`;
      const uploadStorage = await storage.bucket('catatmak-private').upload(file.path, {
        destination: destinationFileName,
      });

      if (!uploadStorage && uploadStorage.length < 0) {
        return wrapper.error(uploadStorage, 'internal server error', 500);
      }

      // Set the expiration time for the signed URL (in seconds)
      const expiration = 3000; // 5 minutes

      // Generate a signed URL
      const signedUrl = await storage.bucket('catatmak-private').file(destinationFileName).getSignedUrl({
        action: 'read', // specify the action, e.g., 'read', 'write', 'delete'
        expires: Date.now() + expiration * 1000, // expiration time in milliseconds
      });


      const mindeeClient = new mindee.Client({apiKey: mindeeApi});

      // Load a file from disk
      const inputSource = mindeeClient.docFromPath(file.path);

      // Parse the file
      const apiResponsePromise = mindeeClient.parse(
          mindee.product.ReceiptV5,
          inputSource,
      );

      const apiResponse = await apiResponsePromise; // Wait for the promise to resolve

      if (!apiResponse) {
        return wrapper.data([], 'success insert financial', 201);
      }

      const resultData = [];

      const resp = apiResponse;
      const data = {
        line_items: resp.document.inference.prediction.lineItems,
        supplier_name: resp.document.inference.prediction.supplierName,
      };

      if (data.line_items.length > 0) {
        data.line_items.map((item) => {
          const supplierName = data.supplier_name && data.supplier_name.value ? `[${data.supplier_name.value}] ${item.description}` : item.description;

          const doc = {
            title: supplierName,
            type: 'outcome',
            category: '',
            price: item.totalAmount < 100 ? `${item.totalAmount}000`: item.totalAmount.toString(),
            image_url: signedUrl[0],
            image_name: destinationFileName,
          };

          resultData.push(doc);
        });
      } else {
        resp.document.inference.prediction.totalAmount = Math.floor(resp.document.inference.prediction.totalAmount);

        const doc = {
          title: data.supplier_name?.value ? data.supplier_name?.value : 'Transaksi',
          type: 'outcome',
          category: '',
          price: resp.document.inference.prediction.totalAmount < 100 ? `${resp.document.inference.prediction.totalAmount}000`: resp.document.inference.prediction.totalAmount.toString(),
          image_url: signedUrl[0],
          image_name: destinationFileName,
        };
        resultData.push(doc);
      }
      fs.unlinkSync(file.path);

      return wrapper.data(resultData, 'success generate ocr', 201);
    } catch (error) {
      console.log(error);
      return wrapper.error(error, 'internal server error', 500);
    }
  }
}

module.exports = UpsertClass;
