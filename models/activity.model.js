// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// care plan Schema
const activitySchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
