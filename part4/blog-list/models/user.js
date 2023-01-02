const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {type: String, minLength: 3, require: true, unique: true},
    passwordHash: {type: String, require: true},
    name: {type: String, require: true},
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

// set up a unique validator
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User