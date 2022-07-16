const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose')
const {TempoUser, validate} = require('../models/unconfirmed_user')
const {User} = require('../models/user')

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
router.get('/:id', async(req, res)=>{
    const user = await getSingleUnconfirmedUser(req.params.id)
    return res.send(user)
})
// need to check for email in both lists
router.post("/", async(req, res) =>{
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        let user = await TempoUser.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');


        user = new TempoUser(_.pick(req.body, ['name', 'email', 'password', 'phoneNumber']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return res.status(200).send("successful")
    }
    catch(err){
        console.log(err)
        return res.status(400).send("error occured")
    }
})


module.exports.router = router
module.exports.getSingleUnconfirmedUser = getSingleUnconfirmedUser
module.exports.deleteFromList =deleteFromList