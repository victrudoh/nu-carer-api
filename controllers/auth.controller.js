// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/user.model");

// Middlewares
const {
  signUpValidation,
  loginValidation,
} = require("../middlewares/validate");

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
      const { firstName, lastName, userName, email, password, role } = req.body;

      const body = { ...req.body };

      // Run Hapi/Joi validation
      const { error } = await signUpValidation.validateAsync(body);
      if (error) return res.status(400).send(error.details[0].message);

      //   check if email exist
      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        return res.status(400).send({
          success: false,
          message: "Email exists",
        });
      }

      //   Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // create user
      const user = new User({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();

      return res.status(200).send({
        success: true,
        data: {
          user: user,
        },
        message: `New ${user.role} registered successfully`,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  // Login
  postLoginController: async (req, res, next) => {
    try {
      const { userName, password } = req.body;

      // Run Hapi/Joi validation
      const { error } = await loginValidation.validateAsync(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      //   check if user exist
      const user = await User.findOne({ userName });
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
