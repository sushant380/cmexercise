const createError = require('http-errors');
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const customerRouter = require('./route');
const initializeDb = require('./db');
const port = 8080;
const app = express();
initializeDb(db => {
  app.set('port', port);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/customers', customerRouter);
  app.use('/', (req, res) => {
    res.redirect('/customers');
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  /**
   * Listen on provided port, on all network interfaces.
   */

  app.listen(port);
});

module.exports = app;
