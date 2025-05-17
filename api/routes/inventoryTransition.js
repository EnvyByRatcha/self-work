const express = require("express");
const inventoryTransitionController = require("../controllers/InventorytransitionController");
const inventoryTransitionRouter = express.Router();
const auth = require("../middleware/auth");

inventoryTransitionRouter
  .route("/")
  .get(inventoryTransitionController.getAllInventoryTransitions)
  .post(
    auth.verifyToken,
    inventoryTransitionController.createInventoryTransition
  );

inventoryTransitionRouter
  .route("/:id")
  .get(inventoryTransitionController.getInventoryTransitionById);

inventoryTransitionRouter
  .route("/approve/:id")
  .put(inventoryTransitionController.approveTransition);

inventoryTransitionRouter
  .route("/technicianIssued")
  .post(auth.verifyToken, inventoryTransitionController.createTechnicianIssued);

module.exports = inventoryTransitionRouter;
