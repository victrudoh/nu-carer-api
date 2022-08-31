// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/user.model");

// Middlewares
const { signUpValidation, loginValidation } = require("../middlewares/validate");
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

  //   SignUp
  postSignUpController: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const body = { ...req.body, media: req.file };

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

      // send image to Cloudinary
      const media = await uploadImageSingle(req, res, next);

      //   Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // create user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        media,
      });
      await user.save();


      return res.status(200).send({
        success: true,
        data: {
          user: user,
        },
        message: "User Registered successfully",
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
        const { email, password } = req.body;

        // Run Hapi/Joi validation
        const { error } = await loginValidation.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //   check if user exist
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).send("Invalid email or password");

        // validate password
        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword)
          return res.status(400).send("Invalid email or password");

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
