// Dependencies
const jwt = require("jsonwebtoken");
var moment = require("moment-timezone");

// Models
const Resident = require("../models/resident.model");
const Caregiver = require("../models/caregiver.model");
const Careplan = require("../models/careplan.model");
const Timesheet = require("../models/timesheet.model");

module.exports = {
  //   Test API connection
  getPingController: (req, res) => {
    try {
      return res.status(200).send({
        success: true,
        message: "Pong",
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't ping",
        // errMessage: err.message,
      });
    }
  },

  //  care giver check in
  getcheckInController: async (req, res) => {
    try {
      const { id } = req.query;

      // find caregiver
      const caregiver = await Caregiver.findById({ _id: id });

      if (!caregiver) {
        return res.status(400).send({
          success: false,
          message: "Couldn't find care giver",
          // errMessage: err.message,
        });
      }

      // date
      const checkInDate = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      const timesheet = new Timesheet({
        caregiverId: caregiver.id,
        checkInDate: checkInDate.split(" ")[0],
        checkInTime: checkInDate.split(" ")[1],
      });
      await timesheet.save();

      return res.status(200).send({
        success: true,
        message: `Care giver - ${caregiver.name} Checked in`,
        data: timesheet,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't check in",
        // errMessage: err.message,
      });
    }
  },

  //  care giver check out
  getcheckOutController: async (req, res) => {
    try {
      const { id } = req.query;

      // find caregiver
      const caregiver = await Caregiver.findById({ _id: id });

      if (!caregiver) {
        return res.status(400).send({
          success: false,
          message: "Couldn't find care giver",
          // errMessage: err.message,
        });
      }

      // date
      const getDate = moment().tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:SS");

      //  split the date and then check DB for date that matches
      checkOutDate = getDate.split(" ")[0];
      checkOutTime = getDate.split(" ")[1];

      const foundSession = await Timesheet.findOne({
        checkInDate: checkOutDate,
      });

      //  if no date, bring back error 400, You haven't checked in today, please check in
      if (!foundSession) {
        return res.status(400).send({
          success: false,
          message: "You haven't checked in today, please check in",
          // errMessage: err.message,
        });
      }

      //   if already checked out
      if (foundSession.checkOutDate !== "not-checked-out") {
        return res.status(400).send({
          success: false,
          message: "You have already checked out today",
          // errMessage: err.message,
        });
      }

      // if date found, update the checkoutDate and time to current time and date
      foundSession.checkOutDate = checkOutDate;
      foundSession.checkOutTime = checkOutTime;
      await foundSession.save();

      return res.status(200).send({
        success: true,
        message: `Care giver - ${caregiver.name} Checked in`,
        data: foundSession,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't check out",
        // errMessage: err.message,
      });
    }
  },
};
