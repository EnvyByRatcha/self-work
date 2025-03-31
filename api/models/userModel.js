const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    level: { type: String, default: "employee" },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
