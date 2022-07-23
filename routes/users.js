const express = require('express');
const {auth_middle, authAdminManager} = require('../middleware/auth')
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose')
const {getSingleUnconfirmedUser, deleteFromList} = require('./unconfirmed_users')
const {User, validate, validatePassword, validateChange} = require('../models/user')
const {TempoUser} = require('../models/unconfirmed_user')
var nodemailer = require('nodemailer');
const Fawn = require('fawn')
const config = require('config')
const bcrypt = require('bcrypt');
const { Log } = require('../models/log');
const sendMail = require('../mail/data');
const validator = require('../middleware/validate')
const objectId = require('../middleware/objectId_validation')

Fawn.init('mongodb://127.0.0.1:27017/stationary')
  
async function getUserWithEmail(email){
    const user = await User.find({email: email})
    return user
}

router.post('/', [auth_middle, authAdminManager, validator(validate)],async(req, res) =>{
    let tempoUserId = req.body.id
    let status = req.body.status
    let tempoUser = await getSingleUnconfirmedUser(tempoUserId)
    if (!tempoUser) return res.status(400).send("Invalid relation")
    let failureMail ='<h1>Sorry,</h1><p> The managers have disapproved your registration, please contact the office for more information</p>'
    let SuccessMail ='<h1>Congratulations,</h1><p> The managers have accepted your registration, please contact the office for more information, you can now login to the app</p>'
    
    let the_user = await User.findById(req.user)
    if (status ==0){
      let log =new Log({
        logString: `${the_user} declined the registration of ${tempoUser.name}`,
        actorsInvolved: [the_user._id, tempoUser._id]
      })
        await log.save();

        await deleteFromList(tempoUserId)
        sendMail('Rejection notice', tempoUser.email, failureMail)
        return res.send("Succeded").status(200)
    }
    if (status==1){

      let log =new Log({
        logString: `${the_user} accepted the registration of ${tempoUser.name}`,
        actorsInvolved: [the_user._id, tempoUser._id]
      })
        await log.save();
          var task = Fawn.Task();
          task.remove(TempoUser, {_id: tempoUserId})
            .save(User, {
                name: tempoUser.name,
                email: tempoUser.email,
                password: tempoUser.password,
                phoneNumber: tempoUser.phoneNumber,
                role:req.body.role
            })
            .run({useMongoose: true})
            .then(console.log("succededd"))
            sendMail('Acceptance notice',tempoUser.email, SuccessMail)
            return res.send("Succeded").status(200)

      }
})

router.put('/password/:id', [auth_middle, validator(validatePassword), objectId] ,async(req, res) =>{
    if (req.user !=  req.params.id){
      return res.status(401).send("Access denied")
    }

    const { error } = validatePassword(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    

    const user = await User.findById(req.user)

    const validPassword = await bcrypt.compare(req.body.old_password, user.password)
    if(!validPassword) return res.status(400).send("Invalid password")

    const salt = await bcrypt.genSalt(10);
    console.log(user.password)
    user.password = await bcrypt.hash(req.body.new_password, salt);
    console.log(user.password)
    await user.save();

    return res.send("Successful")
})

router.get("/", async (req, res)=>{
  const users = await User.find().select("name email phoneNumber role")
  return res.send(users)
})

router.get("/me",auth_middle, async (req, res)=>{
  const users = await User.findOne({_id: req.user}).select("name email phoneNumber role")
  return res.send(users)
})


router.get("/managers", auth_middle, async (req, res)=>{
  const users = await User.find({role: "manager"}).select("name email phoneNumber role")
  return res.send(users)
})


router.get("/retailers",auth_middle, async (req, res)=>{
  const users = await User.find({role: "retailer"}).select("name email phoneNumber role")
  return res.send(users)
})


router.get("/employees",auth_middle, async (req, res)=>{
  const users = await User.find({role: "employee"}).select("name email phoneNumber role")
  return res.send(users)
})

router.put("/me",[auth_middle,validator(validateChange) ],async (req, res)=>{
    const { error } = validateChange(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    

    const user = await User.findById(req.user)

    const email = String(req.body.email)
    user.name = req.body.name
    user.email = email.toLowerCase().trim()
    user.phoneNumber = req.body.phoneNumber

    await user.save();

    return res.send("Successful")
})


module.exports.router =router
module.exports.getUserWithEmail =getUserWithEmail