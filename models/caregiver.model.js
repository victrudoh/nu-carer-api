// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// User Schema
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
    sex: {
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
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Caregiver", caregiverSchema);
