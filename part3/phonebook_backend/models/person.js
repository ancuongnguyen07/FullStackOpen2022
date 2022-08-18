const mongoose = require('mongoose')

// set up mongoose DB
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err.message)
    })

// set up schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
// transform returned schema
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// set up mongoose model
module.exports = mongoose.model('Person', personSchema)