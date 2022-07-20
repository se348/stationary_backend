const request = require('supertest')
const {User} = require('../../models/user')
const {Product} = require('../../models/product')
const bcrypt = require('bcrypt');
const { TemporaryOrder } = require('../../models/temporaryOrder');
let server;

describe("products",()=>{
    describe("POST /", ()=>{
        beforeEach(async ()=>{
            server =require('../../index')
            await User.remove({})
            await Product.remove({})
            await TemporaryOrder.remove({})
        } )
        afterEach( async ()=>{
            server.close(); 
            await User.remove({})
            await Product.remove({})
            await TemporaryOrder.remove({})
        })
        it(" should return 200 because valid  product",async ()=>{
            const salt = await bcrypt.genSalt(10);
            let password = "Semir8483";
            let encpassword = await bcrypt.hash(password, salt);
    
            const user = User({
                name: 'semir', 
                email: "semir2578@gmail.com",
                password: encpassword,
                phoneNumber: '0984836749',
                role: "admin"
            })
            await user.save()
            console.log(user)
            let token = user.generateAuthToken()
            console.log(token)
            const res = await request(server)
                    .post('/api/products')
                    .set('auth-token', token)
                    .send({
                        name: "pencil case",
                        description: "this is the best pen around the globe with gold wrap",
                        packageAmount: 35,
                        individualQuantity: 7,
                        measurement: "kilogram",
                        price: 75.99,
                        category: "thrr"
                    })

            console.log(res.body)
            expect(res.status).toBe(200)
        })
    })

    describe("DELETE /:id", ()=>{
        beforeEach(async ()=>{
            server =require('../../index')
            await User.remove({})
            await Product.remove({})
            await TemporaryOrder.remove({})
        } )
        afterEach( async ()=>{
            await server.close(); 
            await User.remove({})
            await Product.remove({})
            await TemporaryOrder.remove({})
        })
        it(" should return 200 because it is valid product id",async ()=>{
            const salt = await bcrypt.genSalt(10);
            let password = "Semir8483";
            let encpassword = await bcrypt.hash(password, salt);
            let product = Product({
                name: "pencil case",
                description: "this is the best pen around the globe with gold wrap",
                packageAmount: 35,
                individualQuantity: 7,
                measurement: "kilogram",
                price: 75.99,
                category: "thrr"})
            let user = User({
                name: 'semir', 
                email: "semir2578@gmail.com",
                password: encpassword,
                phoneNumber: '0984836749',
                role: "admin"
            })
            await user.save()
            await product.save()
            let token = user.generateAuthToken()
            const res = await request(server)
                    .delete('/api/products/'+ product._id.valueOf())
                    .set('auth-token', token)
            expect(res.status).toBe(200)
        })
        it(" should return 404 because it is an invalid sting ",async ()=>{
            const salt = await bcrypt.genSalt(10);
            let password = "Semir8483";
            let encpassword = await bcrypt.hash(password, salt);
            let product = Product({
                name: "pencil case",
                description: "this is the best pen around the globe with gold wrap",
                packageAmount: 35,
                individualQuantity: 7,
                measurement: "kilogram",
                price: 75.99,
                category: "thrr"})
            let user = User({
                name: 'semir', 
                email: "semir2578@gmail.com",
                password: encpassword,
                phoneNumber: '0984836749',
                role: "admin"
            })
            await user.save()
            await product.save()
            let token = user.generateAuthToken()
            const res = await request(server)
                    .delete('/api/products/1')
                    .set('auth-token', token)
            expect(res.status).toBe(404)
        })

    })
})
