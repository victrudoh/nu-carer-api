// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// User Schema
const adminSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      // min: 6,
      // max: 255,
    },
    email: {
      type: String,
      required: true,
      // min: 6,
      // max: 255,
    },
    password: {
      type: String,
      required: true,
      // min: 6,
      // max: 255,
    },
    // media: {
    //   type: String,
    //   required: true,
    // },
    role: {
      type: String,
      required: true,
      default: "admin",
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

module.exports = mongoose.model("Admin", adminSchema);
