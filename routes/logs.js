const express = require('express')
const router  = express.Router()
const { Log } = require('../models/log')
const { User} =require('../models/user')
router.get("/", auth_middle,async (req, res) =>{
    let user = await User.findById(req.user);
    if (user.role =="admin" || user.role=="manager"){
        let logs = await Log.find().sort({date: -1})
        return res.send(logs)
    }
    else{
        let logs=[]
        let logs_comming = await Log.find().sort({date: -1})
        for (let i=0; i< logs_comming.length; i++){
            if(logs_comming[i].actorsInvolved.includes(req.user)){
                logs.push(logs_comming[i])
            }
        }
        return res.send(logs)
    }
    
})


module.exports = router 