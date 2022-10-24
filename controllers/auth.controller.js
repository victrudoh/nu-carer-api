// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const Admin = require("../models/admin.model");

// Middlewares
const {
  signUpValidation,
  loginValidation,
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
        message: err.message,
      });
    }
  },

  //   Register
  postRegisterController: async (req, res, next) => {
    try {
      const { firstName, lastName, userName, email, password } = req.body;

      // const body = { ...req.body };

      // Run Hapi/Joi validation
      // const { error } = await signUpValidation.validateAsync(body);
      // if (error) return res.status(400).send(error.details[0].message);

      //   check if email exist
      const emailExists = await Admin.findOne({ email: email });
      if (emailExists) {
        return res.status(400).send({
          success: false,
          message: "Email exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // send image to cloudinary
      // const media = await uploadImageSingle(req, res, next);

      // create user
      const user = new Admin({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        // media,
        role: "admin",
      });
      await user.save();
      console.log("user", user);

      return res.status(200).send({
        success: true,
        data: {
          user: user,
        },
        message: `New ${user.role} registered successfully`,
      });
    } catch (err) {
      console.log("postRegisterController: ~ err", err);
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  // Login
  postLoginController: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Run Hapi/Joi validation
      // const { error } = await loginValidation.validateAsync(req.body);
      // if (error) return res.status(400).send(error.details[0].message);

      //   check if user exist
      const user = await Admin.findOne({ email });

      if (!user) return res.status(400).send("Invalid username or password");

      // validate password
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword)
        return res.status(400).send("Invalid username or password");

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
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};
