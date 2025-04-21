const express = require("express");
const productBashController = require("../controllers/productBashController");

const productBashRouter = express.Router();

productBashRouter
  .route("/product/:id")
  .get(productBashController.getProductBashByProductId);

module.exports = productBashRouter;
