// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const auth = require("../controllers/auth.controller");

// Middlewares
const { multerUploads } = require("../middlewares/multer");

// Stuff
const router = express.Router();

// Routes
router.get("/ping", auth.getPingController);
router.post(
  "/register",
  // multerUploads.single("media"),
  auth.postRegisterController
);
router.post("/login", auth.postLoginController);

module.exports = router;
