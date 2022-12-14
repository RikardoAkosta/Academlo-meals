const dotenv = require("dotenv");

// Utils
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    message: err.message || "it seems that you are not doing your job well!",
  });
};

const handleUniqueEmailError = () => {
  return new AppError("email that has been registered", 400);
};

const handleJWTExpiredError = () => {
  return new AppError("Your session has expired! Please login again.", 401);
};

const handleJWTError = () => {
  return new AppError("Invalid session. Please login again.", 401);
};

const handleImgExceedError = () => {
  return new AppError("You exceeded the number of images allowed", 400);
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "SequelizeUniqueConstraintError") {
      error = handleUniqueEmailError();
    } else if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    } else if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      error = handleImgExceedError();
    }

    sendErrorProd(error, req, res);
  }
};

module.exports = { globalErrorHandler };
