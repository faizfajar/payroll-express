const response = require("../helpers/response");

function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  // Custom error handler if you want to support types
  if (err.name === "SequelizeValidationError") {
    return response.validationError(res, err.errors[0].message);
  }

  return response.error(res, err.message || "Internal server error");
}

module.exports = errorHandler;
