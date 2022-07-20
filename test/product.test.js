const {modifyProduct} = require('../models/product')
describe("modifyProduct",()=>{
    it("should return product with name and measurement of lowercase", () =>{
        const product = {
            name: "Semir Ahmed ",
            measurement: "Kilogram "
        }

        expect(modifyProduct(product)).toMatchObject({name: "semir ahmed", measurement: 'kilogram'})
    })
    it("should return product with name ,category and measurement of lowercase", () =>{
        const product = {
            name: "Semir Ahmed ",
            measurement: "Kilogram ",
            category: "Kires"
        }

        expect(modifyProduct(product)).toMatchObject({category: "kires",name: "semir ahmed", measurement: 'kilogram'})
    })
})