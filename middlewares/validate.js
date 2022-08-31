// Dependencies
const Joi = require("@hapi/joi");

//  Validation
const signUpValidation = Joi.object({
  username: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(4).required(),
  role: Joi.string(),
  // media: Joi.object().required(),
});
const loginValidation = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  signUpValidation,
  loginValidation,
};
