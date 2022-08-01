// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';

const Persons = ({persons}) => persons.map((person) => (
  <p key={person.name}>{person.name} {person.number}</p>
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '39-44-5323523' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 

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
      window.alert(`${newName} is already added to phonebook`)
    } else if (existedNumber !== undefined){
      window.alert(`${newNumber} is already added to phonebook`)
    } 
    else{
      const copy = [...persons]
      const newPersons = copy.concat({ name: newName, number: newNumber})
      setPersons(newPersons)
      setNewName('')
      setNewNumber('')
    }
  }

  const handleSubmitForm = (event) => {
    event.preventDefault()
    addNewPerson()
  }

  const searchName = (event) => {
    const text = event.target.value
    setSearchedName(text)
    const copy = [...persons]
    const result = copy.filter(p => p.name.toLowerCase().includes(text.toLowerCase()))
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
      <Persons persons={persons} />
    </div>
  )
}

export default App;
