// import logo from './logo.svg';
// import './App.css';
import { useState, useEffect } from 'react';
import personService from './services/persons';

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

  const handleTypeName = (event) => {
    setNewName(event.target.value)
  }

  const handleTypeNumber = (event) => {
    setNewNumber(event.target.value)
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
              })
             }
    } else if (existedNumber !== undefined){
      window.alert(`${newNumber} is already added to phonebook`)
    } 
    else{
      const newPerson = {name: newName, number: newNumber, id: persons.length + 1}
      personService.create(newPerson).then(returnedPerson => {
        const updatedPersons = dbPersons.concat(returnedPerson)
        setPersons(updatedPersons)
        setDbPersons(updatedPersons)
        setNewName('')
        setNewNumber('')
        setSearchedName('')
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
