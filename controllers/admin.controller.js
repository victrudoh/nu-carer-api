// Dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var moment = require("moment-timezone");

// Models
const Resident = require("../models/resident.model");
const Caregiver = require("../models/caregiver.model");
const Careplan = require("../models/careplan.model");
const Timesheet = require("../models/timesheet.model");
const Admin = require("../models/admin.model");

// Middlewares
const {
  residentValidation,
  caregiverValidation,
} = require("../middlewares/validate");
const { uploadImageSingle } = require("../middlewares/cloudinary.js");

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

  // Get active admin
  getActiveAdminController: async (req, res, next) => {
    try {
      const { id } = req.query;

      //   check if user exist
      const admin = await Admin.findOne({ _id: id });
      console.log(
        "🚀 ~ file: admin.controller.js ~ line 44 ~ getActiveAdminController: ~ admin",
        admin
      );

      if (!admin)
        return res.status(400).send({
          success: false,
          message: "Couldn't fetch Admin",
        });

      return res.status(200).send({
        success: true,
        data: {
          admin: admin,
        },
        message: "Fetched active admin",
      });
    } catch (err) {
      console.log(
        "🚀 ~ file: auth.controller.js ~ line 138 ~ getUserByIdController: ~ err",
        err
      );
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  //   *
  //   **
  //   ***
  //   **
  //   *

  //***** RESIDENTS *****//
  // create resident
  postCreateResidentController: async (req, res, next) => {
    try {
      const { name, age, contact, careplan } = req.body;

      // const { media } = req.file;

      // const body = { ...req.body, media };

      // // Run Hapi/Joi validation
      // const { error } = await residentValidation.validateAsync(body);
      // if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      // const media = await uploadImageSingle(req, res, next);

      // date
      const dateCreated = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      // create resident
      const resident = new Resident({
        name,
        age,
        contact,
        careplan,
        // media,
        dateCreated,
      });
      await resident.save();

      return res.status(200).send({
        success: true,
        message: "Created new resident",
        data: {
          resident,
        },
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't create resident",
        // errMessage: err.message,
      });
    }
  },

  // find resident by ID
  getResidentByIdController: async (req, res) => {
    try {
      const { id } = req.query;

      // find resident
      const resident = await Resident.findById({ _id: id });

      //   if no resident was found
      if (!resident) {
        return res.status(500).send({
          success: false,
          message: "ID didn't match a resident",
          // errMessage: err.message,
        });
      }

      // Find careplan for resident
      let careplan = await Careplan.find({ residentId: id });

      //   if no careplan was found
      if (!careplan) {
        careplan = "unassigned";
      }

      return res.status(200).send({
        success: true,
        message: "Found Resident",
        data: {
          resident: resident,
          careplan: careplan,
        },
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't find resident",
        //   errMessage: err.message,
      });
    }
  },

  //   find all residents
  getAllResidentsController: async (req, res) => {
    try {
      const residents = await Resident.find();

      //   if no resident was found
      if (!residents) {
        return res.status(500).send({
          success: false,
          message: "No residents",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: "Fetched residents",
        length: residents.length,
        data: residents,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch residents",
        // errMessage: err.message,
      });
    }
  },

  // edit resident
  postEditResidentController: async (req, res, next) => {
    try {
      const { id } = req.query;
      const { name, age, contact } = req.body;

      // const { media } = req.file;

      // const body = { ...req.body, media };

      // Run Hapi/Joi validation
      // const { error } = await residentValidation.validateAsync(body);
      // if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      // const image = await uploadImageSingle(req, res, next);

      // date
      const dateModified = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      const resident = await Resident.findById({ _id: id });

      //   if no resident was found
      if (!resident) {
        return res.status(500).send({
          success: false,
          message: "ID didn't match a resident",
          // errMessage: err.message,
        });
      }

      resident.name = name;
      resident.age = age;
      resident.contact = contact;
      // resident.careplan = careplan;
      // resident.image = image;
      resident.dateModified = dateModified;
      await resident.save();
      console.log("resident", resident);

      return res.status(200).send({
        success: true,
        message: `Edited resident ${resident.name} successfully`,
        data: {
          resident,
        },
      });
    } catch (err) {
      console.log("postEditResidentController: ~ err", err);
      return res.status(500).send({
        success: false,
        message: "Couldn't edit resident",
        // errMessage: err.message,
      });
    }
  },

  // delete resident
  deleteResidentController: async (req, res) => {
    try {
      const { id } = req.query;

      const resident = await Resident.findByIdAndDelete({ _id: id });

      //   if no resident was found
      if (!resident) {
        return res.status(500).send({
          success: false,
          message: "ID didn't match a resident",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Deleted resident: ${resident.name} successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't delete resident",
        // errMessage: err.message,
      });
    }
  },

  // create care plan
  postCreateCarePlanController: async (req, res) => {
    try {
      const { caregiverId, plan } = req.body;
      const { residentId } = req.query;

      // check if resident exists
      const foundResident = await Resident.findById({ _id: residentId });
      if (!foundResident) {
        return res.status(500).send({
          success: false,
          message: "Resident not found",
          // errMessage: err.message,
        });
      }

      // check if caregiver exists
      const foundCaregiver = await Caregiver.findById({ _id: caregiverId });
      if (!foundCaregiver) {
        return res.status(500).send({
          success: false,
          message: "Care giver not found",
          // errMessage: err.message,
        });
      }

      // date
      const dateCreated = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      // save
      const careplan = new Careplan({
        residentId,
        caregiverId,
        plan,
        dateCreated,
      });
      await careplan.save();

      console.log("Created new care plan");

      return res.status(200).send({
        success: true,
        message: "Created new Care plan",
        data: {
          careplan,
        },
      });
    } catch (err) {
      console.log("postCreateCarePlanController: ~ err: ", err);
      return res.status(500).send({
        success: false,
        message: "Couldn't create Care plan",
        // errMessage: err.message,
      });
    }
  },

  // edit care plan
  postEditCarePlanController: async (req, res, next) => {
    try {
      const { id } = req.query;

      return res.status(200).send({
        success: true,
        message: `Successfully edited care plan for ${resident.name}`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't edit care plan",
        // errMessage: err.message,
      });
    }
  },

  //   *
  //   **
  //   ***
  //   **
  //   *

  //***** CARE GIVERS *****//
  //   create care givers
  postCreateCaregiverController: async (req, res, next) => {
    try {
      const { name, email, password, phone, gender, address, licenseNo } =
        req.body;

      // const { media } = req.file;

      // const body = { ...req.body, media };

      // // Run Hapi/Joi validation
      // const { error } = await caregiverValidation.validateAsync(body);
      // if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      // const media = await uploadImageSingle(req, res, next);

      //   Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // date
      const dateCreated = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      // create caregiver
      const caregiver = new Caregiver({
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
        address,
        licenseNo,
        // media,
        dateCreated,
      });
      await caregiver.save();

      return res.status(200).send({
        success: true,
        message: "Created new Care giver",
        data: {
          caregiver,
        },
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't create Care giver",
        errMessage: err.message,
      });
    }
  },

  // find care giver by ID
  getCaregiverByIdController: async (req, res) => {
    try {
      const { id } = req.query;

      const caregiver = await Caregiver.findById({ _id: id });

      //   if no caregiver was found
      if (!caregiver) {
        return res.status(500).send({
          success: false,
          message: "ID didn't match a care giver",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: "Found care giver",
        data: {
          caregiver,
        },
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't find care giver",
        //   errMessage: err.message,
      });
    }
  },

  //   find all caregivers
  getAllCaregiversController: async (req, res) => {
    try {
      const caregivers = await Caregiver.find();

      //   if no resident was found
      if (!caregivers) {
        return res.status(500).send({
          success: false,
          message: "No care givers",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: "Fetched care giver",
        length: caregivers.length,
        data: caregivers,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch care givers",
        // errMessage: err.message,
      });
    }
  },

  // edit care giver
  postEditCaregiverController: async (req, res, next) => {
    try {
      const { id } = req.query;
      const { name, email, password, phone, gender, address, licenseNo } =
        req.body;

      // const { media } = req.file;

      // const body = { ...req.body, media };

      // Run Hapi/Joi validation
      // const { error } = await caregiverValidation.validateAsync(body);
      // if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      // const image = await uploadImageSingle(req, res, next);

      // date
      const dateModified = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      const caregiver = await Caregiver.findById({ _id: id });

      //   if no caregiver was found
      if (!caregiver) {
        return res.status(400).send({
          success: false,
          message: "ID didn't match a care giver",
          // errMessage: err.message,
        });
      }

      //   Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      caregiver.name = name;
      caregiver.email = email;
      caregiver.password = hashedPassword;
      caregiver.phone = phone;
      caregiver.gender = gender;
      caregiver.address = address;
      caregiver.licenseNo = licenseNo;
      // caregiver.image = image;
      caregiver.dateModified = dateModified;
      await caregiver.save();
      console.log("caregiver", caregiver);

      return res.status(200).send({
        success: true,
        message: `Edited care giver ${caregiver.name} successfully`,
        data: {
          caregiver,
        },
      });
    } catch (err) {
      console.log("postEditCaregiverController: ~ err: ", err);
      return res.status(500).send({
        success: false,
        message: "Couldn't edit care giver",
        // errMessage: err.message,
      });
    }
  },

  // delete care giver
  deleteCaregiverController: async (req, res) => {
    try {
      const { id } = req.query;

      const caregiver = await Caregiver.findByIdAndDelete({ _id: id });

      //   if no caregiver was found
      if (!caregiver) {
        return res.status(400).send({
          success: false,
          message: "ID didn't match a care giver",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Deleted care giver: ${caregiver.name} successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't delete care giver",
        // errMessage: err.message,
      });
    }
  },

  // view caregiver timesheet
  getTimesheetController: async (req, res) => {
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

      const timesheet = await Timesheet.find({ caregiverId: caregiver.id });

      if (!timesheet) {
        return res.status(400).send({
          success: false,
          message: `No time sheet for care giver - ${caregiver.name}`,
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        length: timesheet.length,
        message: `Fetched time sheet for care giver - ${caregiver.name}`,
        data: timesheet,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch time sheet",
        errMessage: err.message,
      });
    }
  },

  // caregiver report summary
  getSummaryReportController: async (req, res) => {
    try {
      const { id, from, to } = req.query;

      // fetch reports within range
      const reports = await Timesheet.find({
        caregiverId: id,
        checkInDate: { $gte: from, $lte: to },
      });

      // if no report
      if (!reports) {
        return res.status(400).send({
          success: false,
          message: "Couldn't fetch results",
          // errMessage: err.message,
        });
      }

      // get total sessions (just get total checkins)
      // console.log("getSummaryReportController: ~ reports", reports.length);

      // get number of complete clock cycles (completed check ins and outs)
      let clockCycles = 0;
      reports.map((item) => {
        if (item.checkOutDate !== "not-checked-out") {
          clockCycles = clockCycles + 1;
        }
      });

      // populate caregiver details
      const caregiver = await Caregiver.findById({ _id: id });

      // get total hours (no too stress sha)

      // return total sessions, completed clock cycles, caregiver details, total hours
      return res.status(200).send({
        success: true,
        message: `Generated report summary for ${caregiver.name} from ${from} to ${to}`,
        data: {
          sessions: reports.length,
          clockCycles: clockCycles,
          summary: reports,
          caregiver: caregiver,
        },
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't create Care plan",
        // errMessage: err.message,
      });
    }
  },
};
