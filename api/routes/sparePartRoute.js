const express = require("express");
const sparePartController = require("../controllers/sparePartController");

const sparePartRouter = express.Router();

sparePartRouter
  .route("/")
  .get(sparePartController.getAllSpareParts)
  .post(sparePartController.createSparePart);
sparePartRouter
  .route("/:id")
  .get(sparePartController.getSparePartById)
  .delete(sparePartController.removeSparePart)
  .put(sparePartController.updateSparePart);

module.exports = sparePartRouter;
