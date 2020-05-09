const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const crypto = require('crypto');
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')

            }
        }

    },
    password: {
        type: String,
        trim :true,
        required:true,
        minlength: [6,'Too short password'],
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain "password"')
            }
        }
     },
    age: {
        type: Number,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
 }, 
 {
     timestamps :true
 })

 userSchema.virtual('tasks', {
     ref: 'Task',
     localField: '_id',
     foreignField: 'owner'
 })

 userSchema.pre('save', async function(next) {
     const user = this
     console.log('Just before saving! ')

     if(user.isModified('password')) {
         user.password = await bcrypt.hash(user.password, 8)
     }

     next()

 })

 userSchema.methods.toJSON = function () {
     const user = this
     const userObject = user.toObject()

     delete userObject.password
     delete userObject.tokens
    // delete userObject.avatar
     return userObject
 }

 userSchema.methods.generateAuthToken = async function() {
     const user = this

     const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)

     user.tokens = user.tokens.concat({ token })
     await user.save()
     return token
 }
 userSchema.statics.findByCredentials = async (email,password) => {
     const user = await User.findOne({email})

     if(!user) {
         throw new Error('Unable to login')
     }
     const isMatch = await bcrypt.compare(password, user.password)

     if(!isMatch) {
         throw new Error('Unable to login')
     }
     return user
 }

//Hash the plain password before saving
const User = mongoose.model('User', userSchema)

 //  const me = new User({
//      name: '   Neeraj Goyal   ', 
//      email: 'neeraj@gmail.com   ',
//      age: 19,
//      password:'Password'
    
//  })
//  me.save().then(() => {
//     console.log(me) 
//  }).catch((error) => {
//      console.log('Error!',error)
//  })

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
    
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        name: this.name,
    
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

userSchema.methods.generatePasswordReset =async function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}


module.exports = User