// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    media: {
      type: String,
      default: "",
      required: false,
    },
    role: {
      type: String,
      default: 'user'
    //   required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);