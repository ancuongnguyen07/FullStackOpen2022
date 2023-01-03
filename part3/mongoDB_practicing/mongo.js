const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nac:${password}@cluster0.59wu7to.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    // const note = new Note({
    //   content: 'HTML is easy',
    //   date: new Date(),
    //   important: true,
    // })

    // return note.save()

    return Note.find({})
  })
  .then((result) => {
    // console.log('note saved!')

    result.forEach(note => {
      console.log(note)
    })
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))