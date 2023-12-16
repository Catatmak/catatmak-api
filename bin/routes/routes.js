const financialsHandler = require('../modules/financials/handler/api_handler');
const reportsHandler = require('../modules/reports/handler/api_handler');
const ocrHandler = require('../modules/ocr/handler/api_handler');
const userHandler = require('../modules/users/handler/api_handler');
const categoryHandler = require('../modules/category/handler/api_handler');
const insightHandler = require('../modules/insight/handler/api_handler');

// eslint-disable-next-line max-len
const routes = [...financialsHandler, ...reportsHandler, ...ocrHandler, ...userHandler, ...categoryHandler, ...insightHandler];

module.exports = routes;
