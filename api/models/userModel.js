const mongoose = require("mongoose");
const { GENERAL_STATUS, USER_LEVEL } = require("../utils/enum");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    tel_1: { type: String },
    level: { type: String, enum: USER_LEVEL, default: "user" },
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
