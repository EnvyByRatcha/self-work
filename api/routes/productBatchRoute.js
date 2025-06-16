const express = require("express");
const productBatchController = require("../controllers/productBatchController");
const {
  allowAll,
} = require("../middleware/roleAccess");

const productBatchRouter = express.Router();

productBatchRouter
  .route("/product/:id")
  .get(allowAll, productBatchController.getProductBatchByProductId);

module.exports = productBatchRouter;
