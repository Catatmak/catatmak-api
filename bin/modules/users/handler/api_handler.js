/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const GetClass = require('../usecase/get_usecase');
const UpsertClass = require('../usecase/upsert_usecase');
const getUsecase = new GetClass();
const upsertUsecase = new UpsertClass();
const wrapper = require('../../../utils/wrapper');
const commandModel = require('../domain/command_model');
const validator = require('../../../utils/validator');

async function getMyProfile(req, res) {
  const postRequest = async () => {
    return getUsecase.getMyProfile({mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest());
};

async function updateProfile(req, res) {
  const payload = {
    ...req.payload,
  };

  const validatePayload = validator.isValidPayload(payload, commandModel.updateProfile);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.updateProfile({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

const handlers = [
  {
    method: 'GET',
    path: '/profile/my',
    handler: getMyProfile,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'PUT',
    path: '/profile',
    handler: updateProfile,
    options: {
      auth: 'auth-catatmak',
    },
  },
];

module.exports = handlers;
