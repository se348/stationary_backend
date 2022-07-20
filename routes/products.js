const express = require('express')
const router  = express.Router()
const {Product, validate, modifyProduct} = require('../models/product')
const {auth_middle, authAdminManager} = require('../middleware/auth')
const { Log } = require('../models/log')
const { User } = require('../models/user')
const multer = require('multer')
const fs = require('fs')
const validator = require('../middleware/validate')
const objectId =  require('../middleware/objectId_validation')
const storage =multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter =(req, file, cb)=>{
    if(file.mimetype.includes('image/')){
        cb(null, true);
    }
    else{
        cb(null, false)
    }
}
const uploads = multer ({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

router.get("/", auth_middle,async (req, res) =>{
    const products = await Product.find()
    return res.send(products)
})

router.get("/:id", [auth_middle,objectId],async (req, res) =>{

    const product = await Product.findById(req.params.id)
    return res.send(product)
})


router.post("/",[auth_middle ,authAdminManager, uploads.single('image'), validator(validate)], async(req, res) =>{
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        packageAmount: req.body.packageAmount,
        individualQuantity: req.body.individualQuantity,
        measurement: req.body.measurement,
        price: req.body.price,
        category: req.body.category
    })

    if(req.file){
        product.prodImage = req.file.path
    }
    
    product = modifyProduct(product)
        await product.save()

        let the_user = await User.findById(req.user)
        let log = new Log({
           logString: `${the_user.name} added ${product.packageAmount} pieces of ${product.name}`
        })
        await log.save()

        return res.send(product) 
})


router.put("/:id",[auth_middle ,authAdminManager, uploads.single('image'), objectId, validator(validate)],async(req, res) =>{
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

    if (req.file){
        product.prodImage = req.file.path
    }

    product = modifyProduct(product)
    await product.save()
    let the_user = await User.findById(req.user)
    let log = new Log({
        logString: `${the_user.name} modified attributes of ${product.name}`
        })
        await log.save()

    return res.send(product)  
})

router.delete("/:id",[auth_middle,authAdminManager, objectId] ,async(req, res) =>{
    let product = await Product.findByIdAndRemove(req.params.id)
    let the_user = await User.findById(req.user)
    let log = new Log({
        logString: `${the_user.name} deleted the product ${product.name}`
        })
        await log.save()

    if (product.prodImage){
        fs.unlink('./'+product.prodImage, (err) => {
            if (err) {
                console.log(err);
            }
        
            console.log("File is deleted.");
        });
    }
        
    return res.send(product)  
})

module.exports = router 
