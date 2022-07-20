const request = require('supertest')
const {User} = require('../../models/user')
const bcrypt = require('bcrypt')
let server;


describe("auth",()=>{
    describe("POST /", ()=>{
        beforeEach(async ()=>{
            server =require('../../index')
            await User.remove({})
        })
        afterEach( async ()=>{
            await server.close();  
            await User.remove({})
        })

        it(" should return 400 because of invalid  user",async ()=>{
            let salt = await bcrypt.genSalt(10);
            let password = "Semir8483";
            let encpassword = await bcrypt.hash(password, salt);
    
            let user = User({
                name: 'semir', 
                email: "semir2578@gmail.com",
                password: encpassword,
                phoneNumber: '0984836744',
                role: "admin"
            })
            await user.save()
            let res = await request(server)
                    .post('/api/auth')
                    .send({
                        email: "semir2578@gmail.com",
                        password: "1",
                    })

            
            expect(res.status).toBe(400)
        })

        it(" should return 200 because valid  user",async ()=>{
            let salt = await bcrypt.genSalt(10);
            let password = "Semir8483";
            let encpassword = await bcrypt.hash(password, salt);
    
            let user = User({
                name: 'semir', 
                email: "semir2578@gmail.com",
                password: encpassword,
                phoneNumber: '0984836744',
                role: "admin"
            })
            await user.save()
            let res = await request(server)
                    .post('/api/auth')
                    .send({
                        email: "semir2578@gmail.com",
                        password: password,
                    })

            
            expect(res.status).toBe(200)
        })
    })
})

