const mongoose = require("mongoose");

exports.isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

exports.mapJoiErrors = (error) => {
  return error.details.map((err) => ({
    message: err.message,
    path: err.path.join('.'),
  }));
};
