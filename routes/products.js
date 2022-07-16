const express = require('express')
const router  = express.Router()
const {Product, validate, modifyProduct} = require('../models/product')
const {auth_middle} = require('../middleware/auth')
const { Log } = require('../models/log')
const { User } = require('../models/user')


router.get("/", auth_middle,async (req, res) =>{
    const products = await Product.find()
    return res.send(products)
})

router.get("/:id", auth_middle,async (req, res) =>{

    const product = await Product.findById(req.params.id)
    return res.send(product)
})



router.post("/",auth_middle ,async(req, res) =>{
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            packageAmount: req.body.packageAmount,
            individualQuantity: req.body.individualQuantity,
            measurement: req.body.measurement,
            price: req.body.price,
            category: req.body.category
        })
        
        product = modifyProduct(product)
        await product.save()
        let the_user = await User.findById(req.user)
        let log = new Log({
           logString: `${the_user.name} added ${product.packageAmount} pieces of ${product.name}`
        })
        await log.save()

        return res.send(product)
    }
    catch(err){
        console.log(err)
        return res.status(400).send("Error occurred")
    }
     
})


router.put("/:id",auth_middle ,async(req, res) =>{
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        let product = await Product.findById(req.params.id)
        
        product.name = req.body.name,
        product.description = req.body.description,
        product.packageAmount = req.body.packageAmount,
        product.individualQuantity = req.body.individualQuantity,
        product.measurement = req.body.measurement,
        product.price = req.body.price,
        product.category = req.body.category

        product = modifyProduct(product)
        await product.save()
        let the_user = await User.findById(req.user)
        let log = new Log({
            logString: `${the_user.name} modified attributes of ${product.name}`
         })
         await log.save()
 
        return res.send(product)
    }
    catch(err){
        console.log(err)
        return res.status(400).send("Error occurred")
    }
     
})

router.delete("/:id",auth_middle ,async(req, res) =>{
    try{
        let product = await Product.findByIdAndRemove(req.params.id)
        
        let the_user = await User.findById(req.user)
        let log = new Log({
            logString: `${the_user.name} deleted the product ${product.name}`
         })
         await log.save()
 
        return res.send(product)

    }
    catch(err){
        console.log(err)
        return res.status(400).send("Error occurred")
    }
     
})








module.exports = router 