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
    activity: {
      type: String,
      default: "No activity stated",
    },
    assessment: {
      type: String,
      default: "No assessment provided",
    },
    comment: {
      type: String,
      default: "No comment available",
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
