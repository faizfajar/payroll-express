module.exports = {
  success(res, message = "Success", data = null, statusCode = 200) {
    return res.status(statusCode).json({
      status: true,
      message,
      data,
    });
  },

  error(res, message = "Internal Server Error", statusCode = 500) {
    return res.status(statusCode).json({
      status: false,
      message,
      data: null,
    });
  },

  notFound(res, message = "Not found") {
    return res.status(404).json({
      status: false,
      message,
      data: null,
    });
  },

  validationError(res, message = "Invalid input") {
    return res.status(400).json({
      status: false,
      message,
      data: null,
    });
  },
};
