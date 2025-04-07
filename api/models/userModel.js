const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, default: "employee" },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
