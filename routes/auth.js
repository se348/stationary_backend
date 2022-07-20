const jwt = require('jsonwebtoken')
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt')
const router = express.Router();
const mongoose = require('mongoose')
const {User} = require('../models/user')
const Joi = require('joi')
const config = require('config')
const validator = require('../middleware/validate')

router.post('/',validator(validate) ,async(req, res) =>{
    let email = req.body.email.toLowerCase().trim()
    let user = await User.findOne({email: email})
    if (!user) return res.status(400).send("Invalid email or password")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Invalid email or password")

    const token = user.generateAuthToken();
    return res.send(token)
})

function validate(user){
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
  }
  

module.exports =router