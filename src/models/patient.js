const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create patient Schema & model
const PatientSchema = new Schema({
    name:{
        type: String
    },
    email: {
        type: String,
        required: [true, 'Name field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    phone:{
        type:String
      },
    accessToken: {
        type: String,
    }
    
});

const Patient = mongoose.model('patient', PatientSchema);

module.exports = Patient;
