/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const GetClass = require('../usecase/get_usecase');
const UpsertClass = require('../usecase/upsert_usecase');
const getUsecase = new GetClass();
const upsertUsecase = new UpsertClass();

const wrapper = require('../../../utils/wrapper');
const validator = require('../../../utils/validator');
const commandModel = require('../domain/command_model');
const queryModel = require('../domain/query_model');

async function createFinancial(req, res) {
  const payload = {
    ...req.payload,
  };

  const validatePayload = validator.isValidPayload(payload, commandModel.createFinancialModel);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.createFinancial({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function updateFinancial(req, res) {
  const payload = {
    ...req.params,
    ...req.payload,
  };

  const validatePayload = validator.isValidPayload(payload, commandModel.updateFinancialModel);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.updateFinancial({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function deleteFinancial(req, res) {
  const payload = {
    ...req.params,
  };

  const validatePayload = validator.isValidPayload(payload, queryModel.id);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return upsertUsecase.deleteFinancial({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function getAllFinancials(req, res) {
  const payload = {
    ...req.query,
  };
  const validatePayload = validator.isValidPayload(payload, queryModel.getWithDate);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return getUsecase.getAllFinancials({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function getFinancialsTotal(req, res) {
  const payload = {
    ...req.query,
  };
  const validatePayload = validator.isValidPayload(payload, queryModel.getAllQuery);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return getUsecase.getFinancialsTotal({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};


async function getFinancialById(req, res) {
  const payload = {
    ...req.params,
  };

  const validatePayload = validator.isValidPayload(payload, queryModel.id);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return getUsecase.getFinancialById({...result.data, mongo: req.mongo, auth: req.auth});
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message, result.code);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function getFinancialsSummary(req, res) {
  const payload = {
    ...req.query,
  };
  const validatePayload = validator.isValidPayload(payload, queryModel.getWithType);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return getUsecase.getFinancialsSummary({...result.data, mongo: req.mongo, auth: req.auth});
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
    path: '/financials/my',
    handler: getAllFinancials,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'GET',
    path: '/financials/my/total',
    handler: getFinancialsTotal,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'POST',
    path: '/financials',
    handler: createFinancial,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'PUT',
    path: '/financials/{id}',
    handler: updateFinancial,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'GET',
    path: '/financials/{id}',
    handler: getFinancialById,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'DELETE',
    path: '/financials/{id}',
    handler: deleteFinancial,
    options: {
      auth: 'auth-catatmak',
    },
  },
  {
    method: 'GET',
    path: '/financials/my/summary',
    handler: getFinancialsSummary,
    options: {
      auth: 'auth-catatmak',
    },
  },
];

module.exports = handlers;
