// import logo from './logo.svg';
// import './App.css';
import { useState, useEffect } from 'react';
import personService from './services/persons';

const errorStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const successfullStyle = {...errorStyle, color: 'green'}

const Header = ({message, style}) => {
  if (message === null){
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Persons = ({persons, deleteFunc}) => persons.map((person) => (
  <div key={person.id}>
    <p>{person.name} {person.number}</p>
    <button onClick={() => deleteFunc(person)}>delete</button>
  </div>
  
)) 

const Filter = ({ val, onChangeFunc}) => <p>filter shown with <input value={val} onChange={onChangeFunc}/></p>

const PersonForm = ({onSubmitFunc, name, nameOnChangeFunc, number, numberOnChangeFunc}) => (
  <form onSubmit={onSubmitFunc}>
    <div>
      name: <input value={name} onChange={nameOnChangeFunc}/>
    </div>
    <div>
      number: <input value={number} onChange={numberOnChangeFunc}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

function App() {
  // displayed list of persons as a result of filtering and adding
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '39-44-5323523' },
    // { name: 'Ada Lovelace', number: '39-44-5323523' },
    // { name: 'Dan Abramov', number: '12-43-234345' },
    // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 

  // fixed list of db-contained persons
  const [dbPersons, setDbPersons] = useState([])

  // fetching data from json-server
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
      setDbPersons(initialPersons)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchedname, setSearchedName] = useState('')
  const [headerMess, setHeaderMess] = useState(null)
  const [messStyle, setMessStyle] = useState({})

  const handleTypeName = (event) => {
    setNewName(event.target.value)
  }

  const handleTypeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const displayMess = (mess, style) => {
    setHeaderMess(mess)
    setMessStyle(style)
    setTimeout(() => setHeaderMess(null),3000)
  }

  const addNewPerson = () => {
    // handle adding new person
    const existedName = persons.find(p => p.name === newName)
    const existedNumber = persons.find(p => p.number === newNumber)
    if (existedName !== undefined){
      // Already existed person
      // window.alert(`${newName} is already added to phonebook`)
      if (window.confirm(`${existedName.name} is already added to phonebook,`
            + ` replace the old number with a new one?`)){
              const updatedPerson = {...existedName, number: newNumber}
              const id = existedName.id
              personService.update(id, updatedPerson).then(returnedPerson => {
                const updatedPersons = dbPersons.map(p => p.id === id ? returnedPerson : p)
                setDbPersons(updatedPersons)
                setPersons(updatedPersons)
                setNewName('')
                setNewNumber('')

                // display anoucement
                displayMess(`${newNumber} is updated to ${newName}`, successfullStyle)
              })
              .catch(error => {
                // const updatedPersons = dbPersons.filter(p => p.id !== id)
                // setDbPersons(updatedPersons)
                // setPersons(updatedPersons)

                // display anoucement
                displayMess(error.response.data.error, errorStyle)
              })
             }
    } else if (existedNumber !== undefined){
      window.alert(`${newNumber} is already added to phonebook`)
    } 
    else{
      const newPerson = {name: newName, number: newNumber}
      personService.create(newPerson)
        .then(returnedPerson => {
          const updatedPersons = dbPersons.concat(returnedPerson)
          setPersons(updatedPersons)
          setDbPersons(updatedPersons)
          setNewName('')
          setNewNumber('')
          setSearchedName('')

          // display anouncement
          displayMess(`${newName} is added`, successfullStyle)
        })
        .catch(error => {
          // console.log('ERROR')
          displayMess(error.response.data.error, errorStyle)
        })
    }
  }

  const handleClickDeleteButt = person => {
    if (window.confirm(`Delete ${person.name} ?`)){
      personService.deletePerson(person.id)
      const updatedPersons = dbPersons.filter(p => p.id !== person.id)
      setDbPersons(updatedPersons)
      setPersons(updatedPersons)
    }
  }

  const handleSubmitForm = (event) => {
    event.preventDefault()
    addNewPerson()
  }

  const searchName = (event) => {
    const text = event.target.value
    setSearchedName(text)
    const result = dbPersons.filter(p => p.name.toLowerCase().includes(text.toLowerCase()))
    setPersons(result)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Header message={headerMess} style={messStyle} />
      <Filter val={searchedname} onChangeFunc={searchName} />
      <h2>add a new</h2>
      <PersonForm name={newName} nameOnChangeFunc={handleTypeName} 
        number={newNumber} numberOnChangeFunc={handleTypeNumber} onSubmitFunc={handleSubmitForm} />
      <h2>Numbers</h2>
      <Persons persons={persons} deleteFunc={handleClickDeleteButt}/>
    </div>
  )
}

export default App;
