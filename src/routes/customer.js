const express = require("express");
const router = express.Router();
const customerStore = require("../store/customer-store");
router.get("/", (req, res, next) => {
  console.log("calling get all");
  customerStore.getall(
    req.query.limit || 10,
    req.query.pageToken,
    (err, customers, cursor) => {
      if (err) {
        next(err);
      }
      res.json({ ...customers, pageToken: cursor });
    }
  );
});
router.get("/:id", (req, res, next) => {
  customerStore.get(req.param.id, (err, customer) => {
    if (err) {
      next(err);
      return;
    }
    res.json(customer);
  });
});
module.exports = router;
