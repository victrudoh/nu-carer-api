// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// care giver Schema
const caregiverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    licenseNo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "care-giver",
    },
    dateCreated: {
      type: String,
    },
    dateModified: {
      type: String,
      default: "un-modified",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Caregiver", caregiverSchema);
