// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// care plan Schema
const careplanSchema = new Schema(
  {
    residentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Resident",
    },
    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Activity",
    },
    assessment: {
      type: String,
    },
    comment: {
      type: String,
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

module.exports = mongoose.model("Careplan", careplanSchema);
