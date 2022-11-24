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
const Activity = require("../models/activity.model");

// Middlewares
const {
  residentValidation,
  caregiverValidation,
} = require("../middlewares/validate");
const { uploadImageSingle } = require("../middlewares/cloudinary.js");
const { default: mongoose } = require("mongoose");

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
  getActiveUserController: async (req, res, next) => {
    try {
      const { id } = req.query;

      //   check if user exist as admin
      const admin = await Admin.findOne({ _id: id });

      if (!admin) {
        //   check if user exist as caregiver
        const caregiver = await Caregiver.findOne({ _id: id });

        if (!caregiver) {
          return res.status(400).send({
            success: false,
            message: "Couldn't fetch User",
          });
        }

        return res.status(200).send({
          success: true,
          data: {
            user: caregiver,
          },
          message: "Fetched active user",
        });
      }

      return res.status(200).send({
        success: true,
        data: {
          user: admin,
        },
        message: "Fetched active user",
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
      const { name, age, phone, address, gender, zipCode, media } = req.body;

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
        phone,
        address,
        gender,
        zipCode,
        // careplan,
        media,
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
        errMessage: err.message,
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
  putEditResidentController: async (req, res, next) => {
    try {
      const { id } = req.query;
      const { name, age, phone, address, gender, zipCode, media } = req.body;

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
        return res.status(400).send({
          success: false,
          message: "ID didn't match a resident",
          // errMessage: err.message,
        });
      }

      resident.name = name;
      resident.age = age;
      resident.phone = phone;
      resident.address = address;
      resident.gender = gender;
      resident.zipCode = zipCode;
      resident.media = media;
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

  // add activity to care plan
  postAddActivityToCarePlanController: async (req, res) => {
    try {
      const { assessment, comment } = req.body;
      const { residentId, activityId } = req.query;

      // check if resident exists
      const foundResident = await Resident.findById({ _id: residentId });
      if (!foundResident) {
        return res.status(500).send({
          success: false,
          message: "Resident not found",
          // errMessage: err.message,
        });
      }

      // check if the activity exists for the resident
      const foundActivity = await Careplan.findOne({
        residentId: residentId,
        activityId: activityId,
      });
      if (foundActivity) {
        return res.status(400).send({
          success: false,
          message: "This activity already exists for this resident",
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
        activityId,
        assessment,
        comment,
        dateCreated,
      });
      await careplan.save();

      console.log("Created new care plan");

      return res.status(200).send({
        success: true,
        message: `Created new activity for ${foundResident.name}`,
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
  putEditCarePlanController: async (req, res, next) => {
    try {
      const { activityId, residentId } = req.query;
      const { assessment, comment } = req.body;

      // check if resident exists
      const foundResident = await Resident.findById({ _id: residentId });
      if (!foundResident) {
        return res.status(500).send({
          success: false,
          message: "Resident not found",
          // errMessage: err.message,
        });
      }

      // check if the activity exists for the resident
      const foundActivity = await Careplan.findOne({
        residentId: residentId,
        activityId: activityId,
      });

      if (!foundActivity) {
        return res.status(400).send({
          success: false,
          message: "Activity not found",
          // errMessage: err.message,
        });
      }

      // date
      const dateModified = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:mm:SS");

      foundActivity.assessment = assessment;
      foundActivity.comment = comment;
      foundActivity.dateModified = dateModified;
      await foundActivity.save();

      return res.status(200).send({
        success: true,
        message: `Successfully edited care plan for ${foundResident.name}`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't edit care plan",
        errMessage: err.message,
      });
    }
  },

  // delete Careplan activity
  deleteCareplanController: async (req, res) => {
    try {
      const { careplanId } = req.query;

      const foundActivity = await Careplan.findByIdAndDelete({
        _id: careplanId,
      });

      if (!foundActivity) {
        return res.status(400).send({
          success: false,
          message: "Couldn't find activity",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Deleted Activity from Careplan successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't delete activity",
        errMessage: err.message,
      });
    }
  },

  // fetch all careplan activities for a resident
  getCareplanActivitiesController: async (req, res) => {
    try {
      const { residentId } = req.query;
      const activities = await Careplan.find({ residentId: residentId });
      return res.status(200).send({
        success: true,
        data: activities,
        message: `Fetched activities for Careplan successfully`,
      });
    } catch (err) {
      console.log(
        "🚀 ~ file: admin.controller.js ~ line 446 ~ getCareplanActivitiesController: ~ err",
        err
      );
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch activities",
        // errMessage: err.message,
      });
    }
  },

  // assign caregiver to resident
  getAssignCaregiverController: async (req, res) => {
    try {
      const { residentId, caregiverId } = req.query;

      //   check if resident exist
      const resident = await Resident.findOne({ _id: residentId });
      console.log(
        "🚀 ~ file: admin.controller.js ~ line 375 ~ getAssignCaregiverController: ~ resident",
        resident
      );

      if (!resident)
        return res.status(400).send({
          success: false,
          message: "Couldn't fetch Resident",
        });

      //   check if caregiver exist
      const caregiver = await Caregiver.findOne({ _id: caregiverId });

      if (!caregiver)
        return res.status(400).send({
          success: false,
          message: "Couldn't fetch care giver",
        });

      // assign caregiver
      resident.caregiverId = caregiver.id;
      resident.caregiverName = caregiver.name;
      await resident.save();

      return res.status(200).send({
        success: true,
        message: `Assigned Caregiver: ${caregiver.name} to Resident: ${resident.name}`,
      });
    } catch (err) {
      console.log(
        "🚀 ~ file: admin.controller.js ~ line 390 ~ getAssignCaregiverController: ~ err",
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
  // ACTIVITIES FOR CAREPLAN
  postCreateActivityController: async (req, res) => {
    try {
      const { name } = req.body;

      const foundActivity = await Activity.findOne({ name: name });
      if (foundActivity) {
        return res.status(400).send({
          success: false,
          message: "This activity already exists",
          // errMessage: err.message,
        });
      }

      // create and save
      const activity = new Activity({
        name,
      });
      await activity.save();

      return res.status(200).send({
        success: true,
        message: "Created new Activity",
        data: {
          activity,
        },
      });
    } catch (error) {
      console.log("postCreateActivityController: ~ error: ", error);
    }
  },

  putEditActivityController: async (req, res) => {
    try {
      const { id } = req.query;
      const { name, assessment, comment } = req.body;

      const activity = await Activity.findById({ _id: id });
      if (!activity) {
        return res.status(400).send({
          success: false,
          message: "Activity not found",
          // errMessage: err.message,
        });
      }

      activity.name = name;
      activity.assessment = assessment;
      activity.comment = comment;

      await activity.save();
      return res.status(200).send({
        success: true,
        message: `Edited activity ${activity.name} successfully`,
        data: {
          activity,
        },
      });
    } catch (error) {
      console.log("putEditActivityController: ~ error: ", error);
      return res.status(500).send({
        success: false,
        message: "Couldn't delete activity",
        // errMessage: err.message,
      });
    }
  },

  getAllActivityController: async (req, res) => {
    try {
      const activities = await Activity.find();

      return res.status(200).send({
        success: true,
        message: `Fetched all activities successfully`,
        data: {
          activities,
        },
      });
    } catch (error) {
      console.log("getActivityByIdController: ~ error: ", error);
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch activity",
        // errMessage: err.message,
      });
    }
  },

  getActivityByIdController: async (req, res) => {
    try {
      const { id } = req.query;

      const activity = await Activity.findById({ _id: id });
      //   if no activity was found
      if (!activity) {
        return res.status(400).send({
          success: false,
          message: "ID didn't match an activity",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Fetched activity successfully`,
        data: {
          activity,
        },
      });
    } catch (error) {
      console.log("getActivityByIdController: ~ error: ", error);
      return res.status(500).send({
        success: false,
        message: "Couldn't fetch activity",
        // errMessage: err.message,
      });
    }
  },

  deleteActivityController: async (req, res) => {
    try {
      const { id } = req.query;

      const activity = await Activity.findByIdAndDelete({ _id: id });

      //   if no activity was found
      if (!activity) {
        return res.status(400).send({
          success: false,
          message: "ID didn't match an activity",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Deleted Activity: ${activity.name} successfully`,
      });
    } catch (error) {
      console.log("deleteActivityController: ~ error: ", error);
      return res.status(500).send({
        success: false,
        message: "Couldn't delete activity",
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
      const {
        name,
        email,
        password,
        phone,
        gender,
        address,
        licenseNo,
        media,
      } = req.body;

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
        media,
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
        errMessage: err.message,
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
