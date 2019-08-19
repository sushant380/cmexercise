const express = require('express');
const router = express.Router();
const customerModel = require('./customerModel');

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
  customerModel.getAllCustomers(
    req.query.limit || 10,
    req.query.pageToken,
    function(err, result, token) {
      err ? handleError(err, res) : handleResponse(res, customers, token);
    }
  );
});
/**
 * GET /:id retrive customer based on ID passed on.
 */
router.get('/:id', function(req, res) {
  if (isNaN(req.params.id)) {
    return res.sendStatus(400);
  }
  customerModel.getCustomerById(req.params.id, function(err, customers) {
    if (err) {
      handleError(err, res);
    } else {
      customers.length > 0
        ? handleResponse(res, customers[0], null)
        : handleError('404', res);
    }
  });
});
module.exports = router;
