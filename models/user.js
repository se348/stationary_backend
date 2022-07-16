const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId=  require('joi-objectid')(Joi);
const config =require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
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
    role:{
        type: String,
        required: true,
        enum:[
            "manager",
            "retailer",
            "employee",
            "admin"
        ] 
    }
  });

  userSchema.methods.generateAuthToken =function(){
    const token = jwt.sign({_id: this._id}, config.get('Key'))
    return token
  }

  const User  = mongoose.model('User',userSchema)
  function validateUser(user){
    const schema = Joi.object({
        id: Joi.objectId().required(),
        role: Joi.string().valid("manager","retailer","employee","admin").required(),
        status: Joi.number().min(0).max(1).required()
    });
    return schema.validate(user);
  }
  
  function validatePassword(user){
    const schema = Joi.object({
        old_password: Joi.string().min(5).max(255).required(),
        new_password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
  }

  function validateChange(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phoneNumber: Joi.string().min(10).max(10).regex(new RegExp('^[0-9]+$'))
    });
    return schema.validate(user);
  }
exports.User = User
exports.validate =validateUser 
exports.validatePassword = validatePassword
exports.validateChange = validateChange
