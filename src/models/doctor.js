const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create patient Schema & model
const DoctorSchema = new Schema({
    name:{
        type: String
    },
    phone:{
        type:String
    },
    email: {
        type: String,
        required: [true, 'Name field is required'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    days:{
        type:String
    },
    time:{
        type:String
    },
    venue:{
       type:String
    },
    field: {
        type: String,
    }
});

const Doctor = mongoose.model('doctor', DoctorSchema);

module.exports = Doctor;