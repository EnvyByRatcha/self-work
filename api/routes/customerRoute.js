const express = require("express");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");
const customerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter
  .route("/")
  .get(allowAll, customerController.getAllCustomers)
  .post(allowAdmin, customerController.createCustomer);
customerRouter
  .route("/:id")
  .get(allowAll, customerController.getCustomerById)
  .put(allowAdminAndManager, customerController.updateCustomer)
  .delete(allowAdmin, customerController.inactivateCustomer);

module.exports = customerRouter;
