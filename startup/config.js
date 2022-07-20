const config = require('config')

module.exports =function(){
    if (!config.get("Key") || !config.get("Email") || !config.get("Pass")){
        throw new Error("Error set the 3 variables")
    }    
}