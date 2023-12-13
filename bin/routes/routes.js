const financialsHandler = require('../modules/financials/handler/api_handler');
const reportsHandler = require('../modules/reports/handler/api_handler');
const ocrHandler = require('../modules/ocr/handler/api_handler');

const routes = [...financialsHandler, ...reportsHandler, ...ocrHandler];

module.exports = routes;
