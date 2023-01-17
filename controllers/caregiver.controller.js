// Dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var moment = require("moment-timezone");

// Models
const Resident = require("../models/resident.model");
const Caregiver = require("../models/caregiver.model");
const Careplan = require("../models/careplan.model");
const Timesheet = require("../models/timesheet.model");
const Report = require("../models/Report.model");

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

    // CAREGIVER LOGIN
    postCaregiverLoginController: async(req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Caregiver.findOne({ email: email });
            console.log("postCaregiverLoginController: ~ user", user);

            // if no caregiver
            if (!user) return res.status(401).send("Invalid email or password");

            // validate password
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword)
                return res.status(401).send("Invalid email or password");

            //   Generate JWT Token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            return res.status(200).send({
                success: true,
                data: {
                    user: user,
                    token: token,
                },
                message: "Login successful",
            });
        } catch (err) {
            console.log("postCaregiverLoginController: ~ err", err);
            return res.status(500).send({
                success: false,
                message: "Couldn't log in",
                // errMessage: err.message,
            });
        }
    },

    //  care giver check in
    getcheckInController: async(req, res) => {
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
                .tz("Europe/London")
                .format("YYYY-MM-DD HH:mm:SS");

            const foundSession = await Timesheet.findOne({
                checkInDate: checkInDate.split(" ")[0],
            });

            if (foundSession) {
                return res.status(401).send({
                    success: false,
                    message: "You have checked in today already",
                    // errMessage: err.message,
                });
            }

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
    getcheckOutController: async(req, res) => {
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
            const getDate = moment()
                .tz("Europe/London")
                .format("YYYY-MM-DD HH:mm:SS");

            //  split the date and then check DB for date that matches
            checkOutDate = getDate.split(" ")[0];
            checkOutTime = getDate.split(" ")[1];

            const foundSession = await Timesheet.findOne({
                checkInDate: checkOutDate,
            });

            //  if no date, bring back error 400, You haven't checked in today, please check in
            if (!foundSession) {
                return res.status(401).send({
                    success: false,
                    message: "You haven't checked in today, please check in",
                    // errMessage: err.message,
                });
            }

            //   if already checked out
            if (foundSession.checkOutDate !== "not-checked-out") {
                return res.status(401).send({
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
                message: `Care giver - ${caregiver.name} Checked out`,
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

    // Find residents assignrd to
    getAssignedResidentsController: async(req, res) => {
        try {
            const { id } = req.query;
            const residents = await Resident.find({ caregiverId: id });

            if (!residents) {
                return res.status(400).send({
                    success: false,
                    message: "No residents were assiged to you",
                    // errMessage: err.message,
                });
            }

            return res.status(200).send({
                success: true,
                message: `Fetced all residents assigned to you`,
                data: {
                    residents,
                },
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: caregiver.controller.js ~ line 178 ~ getAssignedResidentsController: ~ error",
                error
            );
        }
    },

    // generate report
    postReportController: async(req, res) => {
        try {
            const { residentId, caregiverId } = req.query;

            //   check if user exist as caregiver
            const caregiver = await Caregiver.findOne({ _id: caregiverId });

            if (!caregiver) {
                return res.status(400).send({
                    success: false,
                    message: "Care giver does not exist",
                });
            }

            //   check if user exist as resident
            const resident = await Resident.findOne({ _id: residentId });

            if (!resident) {
                return res.status(400).send({
                    success: false,
                    message: "Resident does not exist",
                });
            }

            // date
            const dateCreated = moment()
                .tz("Europe/London")
                .format("YYYY-MM-DD HH:mm:SS");

            const report = new Report({
                ...req.body,
                residentId,
                caregiverId,
                dateCreated,
            });

            await report.save();

            return res.status(200).send({
                success: true,
                message: "Successfully submitted report",
                data: report,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: caregiver.controller.js:219 ~ postReportController: ~ error",
                error
            );
            return res.status(500).send({
                success: false,
                message: "Couldn't generate report",
                // errMessage: err.message,
            });
        }
    },

    // fetch report
    getReportCotroller: async(req, res) => {
        try {
            const { residentId } = req.query;

            //   check if resident has any report
            const foundReport = await Report.find({ residentId: residentId });

            if (!foundReport) {
                return res.status(400).send({
                    success: false,
                    message: "No report for Resident",
                });
            }

            return res.status(200).send({
                success: true,
                message: `Fetched ${foundReport.length} ${
          foundReport.length === 1 ? "report" : "reports"
        } Successfully`,
                data: foundReport,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: caregiver.controller.js:279 ~ getReportCotroller: ~ error",
                error
            );
            return res.status(500).send({
                success: false,
                message: "Couldn't fetch report",
                // errMessage: err.message,
            });
        }
    },
};