// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// Resident Schema
const residentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    caregiverId: {
      type: Schema.Types.ObjectId,
      ref: "Caregiver",
    },
    caregiverName: {
      type: String,
    },
    media: {
      type: String,
      required: true,
    },
    // careplan: {
    //   communication: {
    //     id: {
    //       type: Number,
    //       default: 1,
    //     },
    //     assessment: {
    //       type: String,
    //     },
    //     comment: {
    //       type: String,
    //     },
    //   },
    // },
    careplanId: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "Careplan",
    },
    role: {
      type: String,
      required: true,
      default: "resident",
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

module.exports = mongoose.model("Resident", residentSchema);
