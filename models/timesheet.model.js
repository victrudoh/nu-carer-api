// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// Timesheet Schema
const timesheetSchema = new Schema(
  {
    caregiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Caregiver",
    },
    checkInDate: {
      type: String,
      default: "not-checked-in",
    },
    checkInTime: {
      type: String,
    },
    checkOutDate: {
      type: String,
      default: "not-checked-out",
    },
    checkOutTime: {
      type: String,
      default: "not-checked-out",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Timesheet", timesheetSchema);
