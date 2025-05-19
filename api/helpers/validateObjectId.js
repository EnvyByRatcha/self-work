const { isValidObjectId } = require("../utils/validators");

const validateObjectId = (id, res) => {
  if (!isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid technician ID",
      errors: { id: "Not a valid ObjectId" },
    });
    return false;
  }

  return true;
};

module.exports = validateObjectId;
