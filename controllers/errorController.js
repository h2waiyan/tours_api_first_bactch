const AppError = require("../apifeatures/appError");

const handleDBIdError = (err) => {
  const message = `Invalid ${err.path} ; ${err.value}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      errorStack: err.stack,
    });
  };

  const sendErrorProd = (err, res) => {
    // Operational Error
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming Error or other Error
    else {
      console.error("Error ", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  };

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "prod") {
    // let error = { ...err };

    // console.log(...err);

    // if (error.name == "CastError") error = handleDBIdError;
    sendErrorProd(err, res);
  }
};
