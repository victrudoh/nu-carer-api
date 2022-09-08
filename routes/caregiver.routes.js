// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const caregiver = require("../controllers/caregiver.controller");

// Stuff
const router = express.Router();

// Routes
router.get("/ping", caregiver.getPingController);
router.post("/login", caregiver.postCaregiverLoginController);
router.get("/check-in", caregiver.getcheckInController);
router.get("/check-out", caregiver.getcheckOutController);

module.exports = router;
