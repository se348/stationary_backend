const Joi = require('joi');
const mongoose = require('mongoose');


const tempoUserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
        type: String,
        minlength: 5,
        maxlength: 255,
      },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
  });

  const TempoUser  = mongoose.model('TempoUser',tempoUserSchema)
  function validateTempoUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        phoneNumber: Joi.string().min(10).max(10).regex(new RegExp('^[0-9]+$'))
    });
    return schema.validate(user);
  }
  
exports.TempoUser = TempoUser
exports.validate =validateTempoUser 