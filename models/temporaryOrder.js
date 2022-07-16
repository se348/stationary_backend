const Joi = require('joi')
const mongoose = require('mongoose');
Joi.objectId=  require('joi-objectid')(Joi);

const temporaryOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
    quantity:{
        type: Number,
        min: 0,
        required: true
      },
    //status -0=> unknown -1 => rejected 1=> accepted
    status:{
      type: Number,
      required: true,
      enum: [
        0,1,2
      ]
    }

  });

const TemporaryOrder  = mongoose.model('TemporaryOrder',temporaryOrderSchema)
  
  function validateTemporaryOrder(temporaryOrderSchema){
    const schema = Joi.object({
        product: Joi.objectId().required(),
        quantity: Joi.number().min(0).required()
    });
    return schema.validate(temporaryOrderSchema);
  }
  
  function validateOrder(orderSchema){
    const schema = Joi.object({
        status: Joi.number().min(-1).max(1)
    });
    return schema.validate(orderSchema);
  }
  
exports.TemporaryOrder = TemporaryOrder
exports.validateTemporaryOrder =validateTemporaryOrder
exports.validateOrder =validateOrder