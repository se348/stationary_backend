const jwt = require('jsonwebtoken');
const config =  require('config')
const {User} = require('../models/user')
function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send("access denied.No token provided.")
    
    try{
        const decoded = jwt.verify(token, config.get('Key'));
        req.user = decoded._id;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

async function authRetail(req, res, next){
    const user = await User.findById(req.user)
    if (!user) return res.status(401).send("Access denied")

    if (user.role != "retailer"){
        return res.status(401).send("Access denied")
    }
    next()
}

async function authManager(req, res, next){
    const user = await User.findById(req.user)
    if (!user) return res.status(401).send("Access denied")

    if (user.role != "manager"){
        return res.status(401).send("Access denied")
    }
    next()
}

async function authEmployee(req, res, next){
    const user = await User.findById(req.user)
    if (!user) return res.status(401).send("Access denied")

    if (user.role != "employee"){
        return res.status(401).send("Access denied")
    }
    next()
}

async function authAdmin(req, res, next){
    const user = await User.findById(req.user)
    if (!user) return res.status(401).send("Access denied")

    if (user.role != "admin"){
        return res.status(401).send("Access denied")
    }
    next()
}

async function authAdminManager(req, res, next){
    console.log(req.user)
    const user = await User.findById(req.user)
    console.log(user)
    if (!user) return res.status(401).send("Access denied")

    if (user.role != "admin" && user.role != "manager"){
        return res.status(401).send("Access denied")
    }
    next()
}


module.exports.auth_middle =auth
module.exports.authRetail =authRetail
module.exports.authManager =authManager
module.exports.authEmployee =authEmployee
module.exports.authAdmin =authAdmin
module.exports.authAdminManager =authAdminManager