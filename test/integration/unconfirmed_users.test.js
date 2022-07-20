const request = require('supertest')
const {TempoUser} = require('../../models/unconfirmed_user')
let server;


describe("unconfirmed_users",()=>{
    describe("POST /", ()=>{
        beforeEach(async ()=>{
            server =require('../../index')
            await TempoUser.remove({});
        } )
        afterEach( async ()=>{
            await server.close(); 
            await TempoUser.remove({});
        })
        it(" should return 400 because of validation error",async ()=>{
            const res = await request(server)
                    .post('/api/unconfirmed_users')
                    .send({
                        name: 'a', 
                        email: "b",
                        password: "a",
                        phoneNumber: 'f'
                    })

            expect(res.status).toBe(400)
        })

        it(" should return 200 because valid  user",async ()=>{
            const res = await request(server)
                    .post('/api/unconfirmed_users')
                    .send({
                        name: 'semir', 
                        email: "Semir2578@gmail.com",
                        password: "Semir8483",
                        phoneNumber: '0984836744'
                    })

            expect(res.status).toBe(200)
        })
    })
})


