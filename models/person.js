const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const phoneNumberValidator = [
    {
        validator: function(num) {
            return num[2] === '-' || num[3] === '-'
        },
        message: 'incorrect format, try DD-DDD... or DDD-DDD...',
    },
    {
        validator: function(num) {
            return /^[0-9-]+$/.test(num)
        },
        message:'invalid phone number'
    },
]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, 'name required']
    },
    number: {
        type: String,
        minlength: 8,
        validate: phoneNumberValidator,
        required: [true, 'phone number required']
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)