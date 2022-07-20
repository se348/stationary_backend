const request = require('supertest')
const {User} = require('../../models/user')
const {Product} = require('../../models/product')
const {TemporaryOrder} = require('../../models/temporaryOrder')
const bcrypt = require('bcrypt')
let server;

describe("orders",()=>{
    describe("POST /", ()=>{
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
        it(" should return 200 because valid product and quantity",async ()=>{
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
            const user = User({
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
                    .post('/api/temporary_orders')
                    .set('auth-token', token)
                    .send({
                        product: product._id,
                        quantity: 20
                    })
            expect(res.status).toBe(200)
        })
        it(" should return 400 because of large quantity",async ()=>{
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
            const user = User({
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
                    .post('/api/temporary_orders')
                    .set('auth-token', token)
                    .send({
                        product: product._id,
                        quantity: 50
                    })
            expect(res.status).toBe(400)
            await User.remove({})
            await Product.remove({})
            await TemporaryOrder.remove({})
        })
    })

})
