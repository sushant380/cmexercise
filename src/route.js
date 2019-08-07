const express = require('express');
const router = express.Router();
const customerStore = require('./store');

const extractFilters = params =>
  Object.keys(params)
    .filter(key => key !== 'limit' || key !== 'pageToken')
    .map(key => ({ field: key, operator: '=', value: params[key] }));

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
router.get('/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send('Bad request. Please check the ID');
  }
  customerStore.get(req.params.id, (err, customer) => {
    if (err) {
      res.status(404).send('Customer not found');
      return;
    }
    res.json(customer);
  });
});
module.exports = router;
