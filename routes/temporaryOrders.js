const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {auth_middle} = require('../middleware/auth')
const {User} = require('../models/user')
const {TemporaryOrder,validateTemporaryOrder, validateOrder} = require('../models/temporaryOrder')
const {Log} = require('../models/log') 
const {Product} =require('../models/product') 
const Fawn = require('fawn');
const sendMail = require('../mail/data');

//Fawn.init('mongodb://127.0.0.1:27017/stationary')
router.get('/',auth_middle, async (req, res) => {
    const temporaryOrder =await TemporaryOrder.find();
    return res.send(temporaryOrder)
  });
router.get('/unconfirmed',auth_middle, async (req, res) => {
    const temporaryOrder =await TemporaryOrder.find().select({status: 0});
    return res.send(temporaryOrder)
});


router.get('/:id',auth_middle, async(req, res)=>{
    const temporaryOrder = await TemporaryOrder.findById(req.params.id)
    return res.send(temporaryOrder)
})

//chack about he qunatity
router.post("/",auth_middle, async(req, res) =>{
    try{
        const { error } = validateTemporaryOrder(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        let temporaryOrder = new TemporaryOrder({
            product : req.body.product,
            quantity: req.body.quantity,
            user: req.user,
            status: 0
        });
        let  user=await User.findById(req.user)
        let product = await Product.findById(temporaryOrder.product)
        if (temporaryOrder.quantity> product.packageAmount){
            return res.send("Not enough amount")
        }
        
        const log = new Log({
            logString : `${user.name} ordered ${temporaryOrder.quantity} pieces of ${product.name}`
        })
        await temporaryOrder.save();
        await log.save()

        return res.status(200).send("You will recieve an email")
    }
    catch(err){
        console.log(err)
        return res.status(400).send("error occured")
    }
})

//user fawn here
router.put("/:id",auth_middle, async(req, res) =>{
    try{
        const { error } = validateOrder(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        
        if (req.body.status!= 1 && req.body.status!=-1){
            return res.status(400).send("Not allowed")
        };
        let temporaryOrder = await TemporaryOrder.findById(req.params.id)
        temporaryOrder.status = req.body.status
        
        let  user=await User.findById(req.user)
        let product = await Product.findById(temporaryOrder.product)
        let userOfproduct = await User.findById(temporaryOrder.user)
        
        if (temporaryOrder.quantity> product.packageAmount){
            return res.status(400).send("Not enough amount")
        }
        
        if (temporaryOrder.status ==1){
            let packageAmount  =product.packageAmount- temporaryOrder.quantity
            const log = new Log({
                logString : `${user.name} approved the order of ${userOfproduct.name}, ${temporaryOrder.quantity} pieces of ${product.name}`
            })
    
            var task = Fawn.Task();
                task.update(TemporaryOrder, {_id: temporaryOrder._id}, {status: 1})
                    .options({multi: true})
                    .save(Log, log)
                    .update(Product, {_id: product._id}, {packageAmount: packageAmount})
                    .run({useMongoose: true})
                    .then(console.log("succededd"))    
            let mail =`<h1>Thank you for shopping with us</h1><main><p>we are very happy that you have bought  ${temporaryOrder.quantity} pieces of ${product.name}</p></main>`
            sendMail('Order Acceptance', userOfproduct.email,mail )
            
        }

        if (temporaryOrder.status == -1){
            await TemporaryOrder.findByIdAndRemove(temporaryOrder._id)
            
            const log = new Log({
                logString : `${user.name} declined the order of ${userOfproduct.name}, ${temporaryOrder.quantity} pieces of ${product.name}`
            })

            await log.save()
            let mail =`<h1>Rejection notice </h1><main><p>we are sorry to tell you that we have rejected your request to buy ${temporaryOrder.quantity} pieces of ${temporaryOrder.name}</p></main>`
            sendMail('Order Acceptance', userOfproduct.email,mail )
            
        }

        
        res.status(200).send("Successful")
        return 
    }
    catch(err){
        console.log(err)
        return res.status(400).send("error occured")
    }
})

module.exports= router