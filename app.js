const createError = require('http-errors');
const express = require('express');
const http = require('http');
const customerRouter = require('./src/customer');
const port = 8080;
const app = express();
app.set('port', port);

app.use(express.json());
app.use('/customers', customerRouter);
app.use('/', (req, res) => {
  res.send('Welcome');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || port);

module.exports = app;
