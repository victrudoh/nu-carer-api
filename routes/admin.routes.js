// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const admin = require("../controllers/admin.controller");

// Middlewares
const { multerUploads } = require("../middlewares/multer");

// Stuff
const router = express.Router();

// Routes
router.get("/ping", admin.getPingController);

//   *
//   **
//   ***
//   **
//   *

// RESIDENTS
router.post(
  "/resident/add",
  multerUploads.single("media"),
  admin.postCreateResidentController
);
router.get("/resident/one", admin.getResidentByIdController);
router.get("/resident/all", admin.getAllResidentsController);
router.post(
  "/resident/edit",
  multerUploads.single("media"),
  admin.postEditResidentController
);
router.delete("/resident/delete", admin.deleteResidentController);

//   *
//   **
//   ***
//   **
//   *

// CAREGIVERS
router.post(
  "/caregiver/add",
  multerUploads.single("media"),
  admin.postCreateCaregiverController
);
router.get("/caregiver/one", admin.getCaregiverByIdController);
router.get("/caregiver/all", admin.getAllCaregiversController);
router.post(
  "/caregiver/edit",
  multerUploads.single("media"),
  admin.postEditCaregiverController
);
router.delete("/caregiver/delete", admin.deleteCaregiverController);

//   *
//   **
//   ***
//   **
//   *

// CAREPLAN
router.post("/careplan/add", admin.postCreateCarePlanController);

module.exports = router;
