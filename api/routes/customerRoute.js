const express = require("express");
const customerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);
customerRouter
  .route("/:id")
  .put(customerController.updateCustomer)
  .delete(customerController.removeCustomer);

module.exports = customerRouter;
