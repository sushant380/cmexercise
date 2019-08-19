const express = require('express');
const router = express.Router();
const customerStore = require('./customerModel');

function handleError(err, res) {
  return err === '404' ? res.sendStatus(404) : res.sendStatus(500);
}

function handleResponse(res, customers, pageToken) {
  return Array.isArray(customers)
    ? res.json({ customers, pageToken })
    : res.json(customers);
}
/**
 * GET /customers returns list of customers available. If there are any filters passed with query, then apply them too.
 * example. /customers
 */
router.get('/', function(req, res) {
  customerStore
    .getAllCustomers(req.query.limit || 10, req.query.pageToken)
    .then(function(result) {
      return handleResponse(res, result.rows, result.pageToken);
    })
    .catch(function(err) {
      return handleError(err, res);
    });
});
/**
 * GET /:id retrive customer based on ID passed on.
 */
router.get('/:id', function(req, res) {
  if (isNaN(req.params.id)) return res.sendStatus(400);

  customerStore
    .getCustomerById(req.params.id)
    .then(function(result) {
      return handleResponse(res, result.rows[0]);
    })
    .catch(function(err) {
      return handleError(err, res);
    });
});
module.exports = router;
