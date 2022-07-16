const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      trim: true
    },
    description: {
      type: String,
      minlength: 5,
      maxlength: 1024,
    },
    packageAmount: {
        type: Number,
        required: true,
        min: 0,
        set: function(v){
            return Math.round(v)
        },
        get: function(v){
            return Math.round(v)
        }
      },
    individualQuantity: {
      type: Number,
      required: true,
      min:0,
    },
    measurement:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    category:{
        type: String,
        default: "none",
        lowercase: true,
        trim: true,
    }
  });


  const Product  = mongoose.model('Product',productSchema)
  function validateProduct(product){
    const schema = Joi.object({
        name: Joi.string().min(3).max(70).required(),
        description: Joi.string().min(3).max(1024).required(),
        packageAmount: Joi.number().min(0).required(),
        individualQuantity: Joi.number().min(0).required(),
        measurement: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string(),
    });
    return schema.validate(product);
  }

  function modifyProduct(product){
    product.name = product.name.toLowerCase().trim()
    product.measurement = product.measurement.trim().toLowerCase()
    if (product.category){
        product.category = product.category.trim().toLowerCase()
    }
    return product

  }
  
exports.Product = Product
exports.validate =validateProduct 
exports.modifyProduct = modifyProduct