const express = require("express");
const morgan = require("morgan");
// const tourRouter = require("./routes/tourRouter");

const AppError = require("./apifeatures/appError");
const errorCtrl = require("./controllers/errorController");

const tourRouter = require("./routes/tourRouter");
// const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());
console.log("?>>>>>>>>>");
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

var myLogger = function (req, res, next) {
  console.log("Hello from Middleware . . . ");
  next();
};

var reqTime = (req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
};

app.use(myLogger); // <------- Middlewares ORDER matters in EXPRESS
app.use(reqTime);

app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(errorCtrl);

module.exports = app;
