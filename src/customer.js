const express = require('express');
const router = express.Router();
const customerModel = require('./customerModel');

/**
 * GET /customers returns list of customers available.
 * example. /customers
 */
router.get('/', function(req, res) {
  customerModel.getAllCustomers(function(err, customers) {
    err ? res.sendStatus(500) : res.json({ customers });
  });
});
/**
 * GET /customers/:id retrive customer based on ID passed on.
 */
router.get('/:id', function(req, res) {
  customerModel.getCustomerById(req.params.id, function(err, customers) {
    err
      ? res.sendStatus(500)
      : res.status(customers.length > 0 ? 200 : 404).json(customers[0]);
  });
});
module.exports = router;
