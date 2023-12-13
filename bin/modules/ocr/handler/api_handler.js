/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const UpsertClass = require('../usecase/upsert_usecase');
const upsertUsecase = new UpsertClass();

const wrapper = require('../../../utils/wrapper');

async function processOCR(req, res) {
  const payload = {
    ...req.payload,
    file: req.payload.file,
  };

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.processOCR({payload, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(payload));
};

const handlers = [
  {
    method: 'POST',
    path: '/ocr',
    handler: processOCR,
    options: {
      auth: 'auth-catatmak',
      payload: {
        maxBytes: 209715200,
        output: 'file',
        parse: true,
        multipart: true, // <-- this fixed the media type error

      },
    },
  },
];

module.exports = handlers;
