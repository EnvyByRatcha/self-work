const express = require("express");
const customerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);
customerRouter
  .route("/:id")
  .get(customerController.getCustomerById)
  .put(customerController.updateCustomer)
  .delete(customerController.inactivateCustomer);

module.exports = customerRouter;
