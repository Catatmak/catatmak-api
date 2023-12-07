/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const GetClass = require('../usecase/get_usecase');
const getUsecase = new GetClass();

const wrapper = require('../../../utils/wrapper');
const validator = require('../../../utils/validator');
const queryModel = require('../domain/query_model');

async function getFinancialChartByDate(req, res) {
  const payload = {
    ...req.query,
  };
  const validatePayload = validator.isValidPayload(payload, queryModel.getWithDate);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return getUsecase.getFinancialChartByDate({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function getFinancialChartByType(req, res) {
  const payload = {
    ...req.query,
  };
  const validatePayload = validator.isValidPayload(payload, queryModel.getWithDate);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return getUsecase.getFinancialChartByType({...result.data, mongo: req.mongo, auth: req.auth});
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
    path: '/financials/charts',
    handler: getFinancialChartByDate,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'GET',
    path: '/financials/charts/type',
    handler: getFinancialChartByType,
    options: {
      auth: 'auth-catatmak',
    },
  },
];

module.exports = handlers;
