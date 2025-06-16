const express = require("express");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");
const technicianController = require("../controllers/technicianController");

const technicianRouter = express.Router();

technicianRouter
  .route("/customer/:id")
  .get(allowAll, technicianController.getTechnicianByCustomerId);

technicianRouter
  .route("/:id")
  .get(allowAll, technicianController.getTechnicianById)
  .put(allowAdminAndManager, technicianController.updateTechnicianById)
  .delete(allowAdmin, technicianController.inactiveTechnicianById);
  
technicianRouter
  .route("/")
  .get(allowAll, technicianController.getAllTechnicians)
  .post(allowAdmin, technicianController.createTechnician);

module.exports = technicianRouter;
