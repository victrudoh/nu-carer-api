// Dependencies
const jwt = require("jsonwebtoken");
var moment = require("moment-timezone");

// Models
const Resident = require("../models/resident.model");
const Caregiver = require("../models/caregiver.model");

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

      const { media } = req.file;

      const body = { ...req.body, media };

      // Run Hapi/Joi validation
      const { error } = await residentValidation.validateAsync(body);
      if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      const image = await uploadImageSingle(req, res, next);

      // date
      const dateCreated = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:MM:SS");

      // create resident
      const resident = new Resident({
        name,
        age,
        contact,
        careplan,
        image,
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
      console.log("postCreateResidentController: ~ err: ", err);
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

      const resident = await Resident.findById({ _id: id });

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
        message: "Found Resident",
        data: {
          resident,
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
      const { name, age, contact, careplan } = req.body;

      const { media } = req.file;

      const body = { ...req.body, media };

      // Run Hapi/Joi validation
      const { error } = await residentValidation.validateAsync(body);
      if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      const image = await uploadImageSingle(req, res, next);

      // date
      const dateModified = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:MM:SS");

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
      resident.careplan = careplan;
      resident.image = image;
      resident.dateModified = dateModified;
      await resident.save();

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
        message: `Deleted resident ${resident.name} successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't delete resident",
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
      const { name, email, phone, sex, address, licenseNo } = req.body;

      const { media } = req.file;

      const body = { ...req.body, media };

      // Run Hapi/Joi validation
      const { error } = await caregiverValidation.validateAsync(body);
      if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      const image = await uploadImageSingle(req, res, next);

      // date
      const dateCreated = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:MM:SS");

      // create resident
      const caregiver = new Caregiver({
        name,
        email,
        phone,
        sex,
        address,
        licenseNo,
        image,
        dateCreated,
      });
      await caregiver.save();

      console.log("Care giver added");

      return res.status(200).send({
        success: true,
        message: "Created new Care giver",
        data: {
          caregiver,
        },
      });
    } catch (err) {
      console.log("postCreateCaregiverController: ~ err: ", err);
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
      const { name, email, phone, sex, address, licenseNo } = req.body;

      const { media } = req.file;

      const body = { ...req.body, media };

      // Run Hapi/Joi validation
      const { error } = await caregiverValidation.validateAsync(body);
      if (error) return res.status(400).send(error.details[0].message);

      // send image to cloudinary
      const image = await uploadImageSingle(req, res, next);

      // date
      const dateModified = moment()
        .tz("Africa/Lagos")
        .format("YYYY-MM-DD HH:MM:SS");

      const caregiver = await Caregiver.findById({ _id: id });

      //   if no caregiver was found
      if (!caregiver) {
        return res.status(500).send({
          success: false,
          message: "ID didn't match a care giver",
          // errMessage: err.message,
        });
      }

      caregiver.name = name;
      caregiver.email = email;
      caregiver.phone = phone;
      caregiver.sex = sex;
      caregiver.address = address;
      caregiver.licenseNo = licenseNo;
      caregiver.image = image;
      caregiver.dateModified = dateModified;
      await caregiver.save();

      console.log(`Edited care giver ${caregiver.name} successfully`);

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
        return res.status(500).send({
          success: false,
          message: "ID didn't match a care giver",
          // errMessage: err.message,
        });
      }

      return res.status(200).send({
        success: true,
        message: `Deleted care giver ${caregiver.name} successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't delete care giver",
        // errMessage: err.message,
      });
    }
  },
};
