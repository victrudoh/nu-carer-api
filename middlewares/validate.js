// Dependencies
const Joi = require("@hapi/joi");

//  REGISTER
const signUpValidation = Joi.object({
  username: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(4).required(),
  role: Joi.string(),
  media: Joi.object().required(),
});

// LOGIN
const loginValidation = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
});

//  CREATE RESIDENT
const residentValidation = Joi.object({
  name: Joi.string().min(4).required(),
  age: Joi.number().required(),
  contact: Joi.string().min(6).required(),
  careplan: Joi.string().min(4).required(),
  role: Joi.string(),
  media: Joi.object(),
});

//  CREATE CAREGIVER
const caregiverValidation = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  phone: Joi.string().min(4).required(),
  sex: Joi.string().required(),
  address: Joi.string().required(),
  licenseNo: Joi.string().required(),
  role: Joi.string(),
  media: Joi.object(),
});

module.exports = {
  signUpValidation,
  loginValidation,
  residentValidation,
  caregiverValidation,
};
