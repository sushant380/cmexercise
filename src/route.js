const express = require('express');
const router = express.Router();
const customerStore = require('./store');

/**
 * Extract query parameters from request and convert them into filter array.
 * @param {Object} params Query parameters passed with request
 */
const extractFilters = params =>
  Object.keys(params)
    .filter(key => key !== 'limit' || key !== 'pageToken')
    .map(key => ({ field: key, operator: '=', value: params[key] }));

/**
 * GET /customers returns list of customers available. If there are any filters passed with query, then apply them too.
 * example. /customers, /customers?country=Sweden
 */
router.get('/', (req, res, next) => {
  customerStore.getall(
    extractFilters(req.query),
    req.query.limit || 10,
    req.query.pageToken,
    (err, customers, cursor) => {
      if (err) {
        next(err);
      }
      res.json({ customers, pageToken: cursor });
    }
  );
});
/**
 * GET /:id retrive customer based on ID passed on.
 */
router.get('/:id', (req, res) => {
  //Check if id is numeric. If not send bad request response.
  if (isNaN(req.params.id)) {
    res.status(400).send('Bad request. Please check the ID');
  }
  customerStore.get(req.params.id, (err, customer) => {
    if (err === '404') {
      //if customer not found then send 404 response
      res.status(404).send('Customer not found');
      return;
    } else if (err) {
      //if error occurs while query to db, then send 500 response.
      res.status(500).send('Something went wrong');
      return;
    }
    res.json(customer);
  });
});
module.exports = router;
