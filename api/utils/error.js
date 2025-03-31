exports.apiError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.status,
  });
};

exports.mapError = (err, status, msg, next) => {
  console.log("Error: ", err.message);

  let error = new Error();
  error.statusCode = status || 500;
  error.status = msg || "Internal server error";

  next(error);
};
