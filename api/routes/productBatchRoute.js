const express = require("express");
const productBatchController = require("../controllers/productBatchController");

const productBatchRouter = express.Router();

productBatchRouter
  .route("/product/:id")
  .get(productBatchController.getProductBatchByProductId);

module.exports = productBatchRouter;
