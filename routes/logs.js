const express = require('express')
const router  = express.Router()
const { Log } = require('../models/log')

router.get("/", auth_middle,async (req, res) =>{
    const logs = await Log.find().sort({date: -1})
    return res.send(logs)
})


module.exports = router 