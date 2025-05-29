const { verifyToken, authorizeRoles } = require("./auth");

const allow = (...roles) => [verifyToken, authorizeRoles(...roles)];

module.exports = {
  allowAll: allow("admin", "manager", "user"),
  allowAdminAndManager: allow("admin", "manager"),
  allowAdmin: allow("admin"),
};
