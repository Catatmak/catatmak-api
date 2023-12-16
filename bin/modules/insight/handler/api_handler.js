/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const GetClass = require('../usecase/get_usecase');
const getUsecase = new GetClass();
const wrapper = require('../../../utils/wrapper');

async function getInsight(req, res) {
  const postRequest = async () => {
    return getUsecase.getInsight({mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest());
};

const handlers = [
  {
    method: 'GET',
    path: '/insight',
    handler: getInsight,
    options: {
      auth: 'auth-catatmak',
    },
  },
];

module.exports = handlers;
