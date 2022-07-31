// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  if (text === "positive"){
    return (
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Feedback = ({ arr }) => {
  const [goodOnClick, neutralOnClick, badOnClick] = arr
  return (
    <div>
      <h3>give feedback</h3>
      <Button text="good" onClick={goodOnClick} />
      <Button text="neutral" onClick={neutralOnClick} />
      <Button text="bad" onClick={badOnClick} />
    </div>
  )
}

const Statistics = ({ arr }) => {
  const [goodStat, neutralStat, badStat] = arr

  if (goodStat === 0 && neutralStat === 0 && badStat === 0){
    return <div>No feedback given</div>
  }

  const all = arr.reduce((pre, curr) => pre + curr, 0)
  let average, posPercent;

  if (all === 0) {
    average = 0
    posPercent = 0
  } else{
    average = (goodStat - badStat) / all
    posPercent = goodStat * 100 / all
  }

  return (
    <table>
      <StatisticLine text="good" value={goodStat} />
      <StatisticLine text="neutral" value={neutralStat} />
      <StatisticLine text="bad" value={badStat} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={posPercent} />
    </table>
  );
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedGood = () => setGood(good + 1)
  const feedNeutral = () => setNeutral(neutral + 1)
  const feedBad = () => setBad(bad + 1)
  const onClicks = [feedGood, feedNeutral, feedBad]

  return (
    <div>
      <Feedback arr={onClicks} />
      <h3>statistics</h3>
      <Statistics arr={[good, neutral, bad]} />
    </div>  
  );
}

export default App;
