const express = require("express");
const technicianController = require("../controllers/technicianController");
const auth = require("../middleware/auth");

const technicianRouter = express.Router();

technicianRouter
  .route("/")
  .get(auth.verifyToken, technicianController.getAllTechnicians)
  .post(auth.verifyToken, technicianController.createTechnician);
technicianRouter
  .route("/:id")
  .get(auth.verifyToken, technicianController.getTechnicianById)
  .put(auth.verifyToken, technicianController.updateTechnicianById)
  .delete(auth.verifyToken, technicianController.inactiveTechnicianById);

module.exports = technicianRouter;
