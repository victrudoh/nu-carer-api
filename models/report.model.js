// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// Report Schema
const reportSchema = new Schema({
    caregiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Caregiver",
    },
    residentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Resident",
    },
    report: {
        type: Object,
        required: true,
    },
    dateCreated: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Report", reportSchema);