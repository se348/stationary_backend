const bcrypt =require('bcrypt')
const {User} = require('../models/user')
const config  =require('config')

module.exports = async function addUsers() {
    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(config.get("Pass"), salt);
    
    const count =await User.find().count()
    if (count == 0){
        try{
            let user =new User({
                name: "admining",
                email: config.get("Email"),
                role: "admin",
                password: password,
                phoneNumber: "0984836744"
            })
            await user.save()
        }
        catch(err){
            console.log("Some Error")
            process.exit(1)
        }
    }
}