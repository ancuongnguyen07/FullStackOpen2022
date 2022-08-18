const mongo = require('mongoose')

const addPerson = (url, person) => {
    mongo
        .connect(url)
        .then((result) => {
            console.log('connect')

            person.save().then(result => {
                mongo.connection.close()
            })
            console.log(`added ${person.name} number ${person.number} to phonebook`)

        })
        .catch((err) => {
            console.log(err)
        })
}

const listPerson = (url) => {
    mongo
        .connect(url)
        .then(() => {
            console.log('connected')
            return Person.find({})
        })
        .then((result) => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongo.connection.close()
        })
        .catch(err => {
            console.log(err)
        })
}

const argvList = process.argv

if (argvList.length != 3 && argvList.length != 5){
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
    console.log('OR node mango.js <password> for showing all entries in DB')
    process.exit(1)
}

const password = argvList[2]
const url = `mongodb+srv://nac:${password}@cluster0.59wu7to.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongo.Schema({
    name: String,
    number: String,
})

const Person = mongo.model('Person', personSchema)

const [name, number] = argvList.slice(3)
const person = new Person({
    name: name,
    number: number,
})

if (argvList.length == 3){
    listPerson(url)
}
else {

    addPerson(url, person)
}



