const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Record Schema & model
const RecordSchema = new Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId, ref:'patient', 
        
    },
    case: [{    
      symptoms:String,  
      medicine: String,
      dose: String,
      date: String
      }]
        
    
});

const Record = mongoose.model('record', RecordSchema);

module.exports = Record;