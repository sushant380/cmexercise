const express = require('express');
const router = express.Router();
const customerStore = require('./store');

/**
 * Extract query parameters from request and convert them into filter array.
 * @param {Object} params Query parameters passed with request
 */
const extractFilters = params =>
  Object.keys(params)
    .filter(key => key !== 'limit' && key !== 'pageToken')
    .map(key => ({ field: key, operator: '=', value: params[key] }));

const handleError = (err, res) =>
  err === '404' ? res.sendStatus(404) : res.sendStatus(500);

const handleResponse = (res, customers, pageToken) => {
  res.json({ customers, pageToken });
};
/**
 * GET /customers returns list of customers available. If there are any filters passed with query, then apply them too.
 * example. /customers, /customers?country=Sweden
 */
router.get('/', (req, res) => {
  customerStore
    .getall(
      extractFilters(req.query),
      req.query.limit || 10,
      req.query.pageToken
    )
    .then(({ rows, pageToken }) => handleResponse(res, rows, pageToken))
    .catch(err => handleError(err, res));
});
/**
 * GET /:id retrive customer based on ID passed on.
 */
router.get('/:id', (req, res) => {
  //Check if id is numeric. If not send bad request response.
  if (isNaN(req.params.id)) return res.sendStatus(400);
  customerStore
    .get(req.params.id)
    .then(({ rows }) => handleResponse(res, rows))
    .catch(err => handleError(err, res));
});
module.exports = router;
