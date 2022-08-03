import {useState} from 'react';

const Form = ({onSubmitFunc}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleTypeName = (event) => {
        setNewName(event.target.value)
    }

    const handleTypeNumber = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <form onSubmit={onSubmitFunc}>
            <div>
                name: <input value={newName} onChange={handleTypeName}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleTypeNumber}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}