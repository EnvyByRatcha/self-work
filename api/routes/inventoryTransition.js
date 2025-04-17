const express = require("express");
const inventoryTransitionController = require("../controllers/InventorytransitionController");
const inventoryTransitionRouter = express.Router();
const auth = require("../middleware/auth");

inventoryTransitionRouter
  .route("/")
  .post(
    auth.verifyToken,
    inventoryTransitionController.createInventoryTransition
  );

module.exports = inventoryTransitionRouter;
