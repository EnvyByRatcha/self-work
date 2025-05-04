const mongoose = require("mongoose");

exports.isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
