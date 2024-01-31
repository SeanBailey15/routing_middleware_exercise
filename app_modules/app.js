const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const itemsRoutes = require("./itemsRoutes");

const app = express();

app.use(express.json());

app.use("/items", itemsRoutes);

app.use((req, res, next) => {
  const err = new ExpressError("Not Found", 404);
  next(err);
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message,
      status: status,
    },
  });
});

module.exports = app;
