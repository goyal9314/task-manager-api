const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
}, {
    timestamps :true
})

userSchema.pre('save', async function(next) {
    const task = this
    console.log('Just before saving! ')

    

    next()

})

const Task = mongoose.model('Task', userSchema)

module.exports = Task