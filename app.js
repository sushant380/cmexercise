const createError = require("http-errors");
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const customerRouter = require("./src/routes/customer");
const customerStore = require("./src/store/customer-store");
const data = require("./data.json");
const port = 8080;
const app = express();
customerStore.uploaddata(data, (err, res) => {
  if (err) {
    console.error("error while restoring data");
  }
  console.log("data restored");
});
app.set("port", port);

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/customers", customerRouter);
app.use("/", (req, res) => {
  // console.log(req);
  res.redirect("/customers");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);

module.exports = app;
