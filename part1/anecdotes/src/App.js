// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react'

const AnecdoteLine = ({ text, vote}) => (
  <div>
    <div>
      {text}
    </div>
    <div>
      has {vote} votes
    </div>
  </div>
) 

function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [selected, setSelected] = useState(0)
  // storing the number of votes of each anecdote
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  const [maxVoteIndex, setMaxVoteIndex] = useState(0)

  // generating random number
  const getRandomInt = (max) => {
    let newSelect = 0
    do{
      newSelect = Math.floor(Math.random() * max)
    } while (selected === newSelect)

    return newSelect;
  }

  // handling button onClick event
  const handleNextAnecdote = () => setSelected(getRandomInt(anecdotes.length ))
  const handleVote = () => {

    const copy = [...votes]
    copy[selected] += 1
    setMaxVoteIndex(copy.indexOf(Math.max(...copy)))
    setVotes(copy)
  }

  return (
    <div>
      <h3>Anecdote of the day</h3>
      <AnecdoteLine text={anecdotes[selected]} vote={votes[selected]} />
      <div>
        <button onClick={handleVote}>vote</button>
        <button onClick={handleNextAnecdote}>next anecdote</button>
      </div>
      <h3>Anecdote with most votes</h3>
      <AnecdoteLine text={anecdotes[maxVoteIndex]} vote={votes[maxVoteIndex]} />
    </div>
    
  );
}

export default App;
