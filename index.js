const mongoose = require('mongoose')
const express = require('express')
const unconfirmed_users = require('./routes/unconfirmed_users')
const users = require('./routes/users')
const auth = require('./routes/auth')
const bcrypt =require('bcrypt')
const app =express()
const {User} = require('./models/user')
const config  =require('config')
const products = require('./routes/products')
const temporaryOrders =require('./routes/temporaryOrders')
console.log(config.get("Email"))
console.log(config.get("Pass"))
if (!config.get("Key") || !config.get("Email") || !config.get("Pass")){
    console.error("Error set the 3 variables")
    process.exit(1)
}


mongoose.connect('mongodb://localhost/stationary')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error('Could not connect to MongoDB...', err))


app.use(express.json())
app.use('/api/unconfirmed_users', unconfirmed_users.router)
app.use('/api/users', users.router)
app.use('/api/auth', auth)
app.use('/api/products', products)
app.use('/api/temporary_orders', temporaryOrders)



async function addUsers() {
    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(config.get("Pass"), salt);
    
    const count =await User.find().count()
    console.log(count)
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
addUsers()


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));