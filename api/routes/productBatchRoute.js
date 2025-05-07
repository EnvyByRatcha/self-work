const express = require("express");
const productBatchController = require("../controllers/productBatchController");

const productBashRouter = express.Router();

productBashRouter
  .route("/product/:id")
  .get(productBatchController.getProductBashByProductId);

module.exports = productBashRouter;
