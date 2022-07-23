const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    logString: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    actorsInvolved:{
        type: [mongoose.Schema.Types.ObjectId],
    }
  });


const Log  = mongoose.model('Log',logSchema)
  
exports.Log = Log