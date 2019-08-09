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

/**
 * Handle error messages
 * @param {String} err Error code
 * @param {*} res Response object
 */

const handleError = (err, res) =>
  err === '404' ? res.sendStatus(404) : res.sendStatus(500);

/**
 * Reponse handler method
 * @param {*} res response object
 * @param {Array} customers List of customers
 * @param {String} pageToken next page toke
 */

const handleResponse = (res, customers, pageToken) => {
  Array.isArray(customers)
    ? res.json({ customers, pageToken })
    : res.json(customers);
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
    .then(({ rows }) => handleResponse(res, rows[0]))
    .catch(err => handleError(err, res));
});
module.exports = router;
