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
router.get("/active", admin.getActiveUserController);

//   *
//   **
//   ***
//   **
//   *

// RESIDENTS
router.post("/resident/add", admin.postCreateResidentController);
router.get("/resident/one", admin.getResidentByIdController);
router.get("/resident/all", admin.getAllResidentsController);

router.put("/resident/edit", admin.putEditResidentController);
router.delete("/resident/delete", admin.deleteResidentController);
router.get("/resident/assign", admin.getAssignCaregiverController);
// careplan
router.post(
  "/resident/add-careplan-activity",
  admin.postAddActivityToCarePlanController
);
router.put("/resident/edit-careplan-activity", admin.putEditCarePlanController);
router.delete(
  "/resident/delete-careplan-activity",
  admin.deleteCareplanController
);
router.get("/resident/careplan", admin.getCareplanActivitiesController);

//   *
//   **
//   ***
//   **
//   *
// ACTIVITIES FOR CAREPLAN
router.get("/activity/all", admin.getAllActivityController);
router.get("/activity/one", admin.getActivityByIdController);
router.post("/activity/add", admin.postCreateActivityController);
router.put("/activity/edit", admin.putEditActivityController);
router.delete("/activity/delete", admin.deleteActivityController);
//   *
//   **
//   ***
//   **
//   *

// CAREGIVERS
router.post("/caregiver/add", admin.postCreateCaregiverController);
router.get("/caregiver/one", admin.getCaregiverByIdController);
router.get("/caregiver/all", admin.getAllCaregiversController);
router.post("/caregiver/edit", admin.postEditCaregiverController);
router.delete("/caregiver/delete", admin.deleteCaregiverController);
router.get("/caregiver/timesheet", admin.getTimesheetController);
router.get("/caregiver/report", admin.getSummaryReportController);

module.exports = router;
