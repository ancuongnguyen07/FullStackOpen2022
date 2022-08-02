// import logo from './logo.svg';
// import './App.css';
import { useState, useEffect} from 'react';
import axios from 'axios'
import Countries from './components/Countries';

const QueryForm = ({val, onChangeFunc}) => <p>find countries <input value={val} onChange={onChangeFunc}/></p>

function App() {
  const [queryCountry, setQueryCountry] = useState('')
  const [resultCountries, setResultCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])

  // fetching data from restcountries API
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log("promise fulfilled")
        let data = response.data
        data = data.map(country => ({...country, isDisplayed: false}))
        // console.log(data)
        setAllCountries(data)
      })
  }, [])

  const handleOnChangeQueryCountry = event => {
    const query = event.target.value
    setQueryCountry(query)
    let result = allCountries.filter(c => c.name.common.toLowerCase().includes(query.toLowerCase()))
    result = result.map(c => ({...c, isDisplayed: false})) // reset to hidden mode
    // console.log(result)
    setResultCountries(result)
  }

  return (
    <div>
      <QueryForm val={queryCountry} onChangeFunc={handleOnChangeQueryCountry} />
      <Countries foundedCountriesList={resultCountries} />
    </div>
  );
}

export default App;
