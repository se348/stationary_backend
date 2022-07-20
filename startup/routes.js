const unconfirmed_users = require('../routes/unconfirmed_users')
const users = require('../routes/users')
const auth = require('../routes/auth')
const products = require('../routes/products')
const temporaryOrders =require('../routes/temporaryOrders')
const error = require('../middleware/error')
const express = require('express')

module.exports = function(app){
    app.use(express.json())
    app.use('/uploads', express.static('uploads'))
    app.use('/api/unconfirmed_users', unconfirmed_users.router)
    app.use('/api/users', users.router)
    app.use('/api/auth', auth)
    app.use('/api/products', products)
    app.use('/api/temporary_orders', temporaryOrders)
    app.use(error)
}