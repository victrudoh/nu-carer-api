// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const Admin = require("../models/admin.model");
const Caregiver = require("../models/caregiver.model");

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
    postRegisterController: async(req, res, next) => {
        try {
            const { firstName, lastName, userName, email, password, media } =
            await req.body;

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

            //   check if userName exist
            const userNameExists = await Admin.findOne({ userName: userName });

            if (userNameExists) {
                return res.status(400).send({
                    success: false,
                    message: "userName exists",
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
                media,
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
    postLoginController: async(req, res, next) => {
        try {
            const { email, password } = req.body;

            // Run Hapi/Joi validation
            // const { error } = await loginValidation.validateAsync(req.body);
            // if (error) return res.status(400).send(error.details[0].message);

            //   check if user exist as admin
            const admin = await Admin.findOne({ email: email });

            // if user not found under admin, check caregivers
            if (!admin) {
                // check if user exist as caregiver
                const caregiver = await Caregiver.findOne({ email: email });
                if (!caregiver) {
                    return res.status(400).send("Invalid email or password");
                }

                // If user exists as caregiver...validate password and continue
                const validatePassword = await bcrypt.compare(
                    password,
                    caregiver.password
                );

                if (!validatePassword)
                    return res.status(400).send("Invalid email or password");

                //   Generate JWT Token
                const token = jwt.sign({ _id: caregiver._id }, process.env.JWT_SECRET);

                return res.status(200).send({
                    success: true,
                    data: {
                        user: caregiver,
                        token: token,
                    },
                    message: "Login successful",
                });
            }

            // validate password
            const validatePassword = await bcrypt.compare(password, admin.password);
            if (!validatePassword)
                return res.status(400).send("Invalid email or password");

            //   Generate JWT Token
            const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

            return res.status(200).send({
                success: true,
                data: {
                    user: admin,
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