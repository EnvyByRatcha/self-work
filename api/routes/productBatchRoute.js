const express = require("express");
const productBatchController = require("../controllers/productBatchController");

const productBatchRouter = express.Router();

productBatchRouter
  .route("/product/:id")
  .get(productBatchController.getProductBashByProductId);

module.exports = productBatchRouter;
