const mongoose = require("mongoose");
const { GENERAL_STATUS } = require("../utils/enum");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, default: "user" },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
