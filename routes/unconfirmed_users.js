const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose')
const {TempoUser, validate} = require('../models/unconfirmed_user')
const {User} = require('../models/user')
const validator = require('../middleware/validate')
const objectId = require('../middleware/objectId_validation')
//validator changing
async function getAllUnconfimedUsers(){
    const users = await TempoUser.find().select('-password');
    return users;
}
async function getSingleUnconfirmedUser(id){
    const user = await TempoUser.findById(id).select('-id');
    return user;
}

async function deleteFromList(id){
    const user =await TempoUser.findByIdAndRemove(id);
    return user
}


router.get('/', async (req, res) => {
    const users =await getAllUnconfimedUsers();
    return res.send(users)
  });
router.get('/:id',objectId ,async(req, res)=>{
    const user = await getSingleUnconfirmedUser(req.params.id)
    return res.send(user)
})

router.post("/",validator(validate) ,async(req, res) =>{
    
    let user = await TempoUser.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');


    user = new TempoUser(_.pick(req.body, ['name', 'email', 'password', 'phoneNumber']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    return res.status(200).send("successful")
})


module.exports.router = router
module.exports.getSingleUnconfirmedUser = getSingleUnconfirmedUser
module.exports.deleteFromList =deleteFromList