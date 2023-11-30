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

async function createBook(req, res) {
  const payload = {
    ...req.payload,
  };

  const validatePayload = validator.isValidPayload(payload, commandModel.createBookModel);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.createBook(result.data);
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function updateBook(req, res) {
  const payload = {
    ...req.params,
    ...req.payload,
  };

  const validatePayload = validator.isValidPayload(payload, commandModel.updateBookModel);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return upsertUsecase.updateBook(result.data);
  };

  const sendResponse = async (result) => {
    if (result.err) {
      return wrapper.response(res, 'fail', result, result.message);
    }

    return wrapper.response(res, 'success', result, result.message, 200);
  };
  return sendResponse(await postRequest(validatePayload));
};

async function deleteBook(req, res) {
  const payload = {
    ...req.params,
  };

  const validatePayload = validator.isValidPayload(payload, queryModel.bookId);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return upsertUsecase.deleteBook(result.data);
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
  const validatePayload = validator.isValidPayload(payload, queryModel.getAllQuery);

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


async function getBookById(req, res) {
  const payload = {
    ...req.params,
  };

  const validatePayload = validator.isValidPayload(payload, queryModel.bookId);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return getUsecase.getBookById(result.data);
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
    path: '/books',
    handler: createBook,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
];

module.exports = handlers;
