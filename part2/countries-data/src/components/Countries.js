import React, { useState } from "react";
import Weather from "./Weather";
import axios from "axios";


const Languages = ({lang}) => (
    <ul>
      {Object.values(lang).map(val => <li key={val}>{val}</li>)}
    </ul>
  )
  
const Country = ({country}) => {
    const [weatherInfo, setNewWeather] = useState({})

    const onClickShowCountry = () => {
        const capital = country.capital[0].replaceAll(' ','%20')
        // hide or show
        country.isDisplayed = !country.isDisplayed

        // fetching weather data from openweather API
        if (country.isDisplayed){
            axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=47fd099e8a28580d62bfd218d2f03cc2&units=metric`)
            .then(response => {
                // console.log("weather info OK")
                setNewWeather(response.data)
            })
        } else{
            setNewWeather({})
        }
      }
    

    if (country.isDisplayed){
        // console.log(country.weather)

        return (
            <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area} km2</p>
            <h3>languages</h3>
            <Languages lang={country.languages} />
            <img src={country.flags.png} alt={country.name.common}/>
            <Weather info={weatherInfo} />
            <div>
                <button value={country.name.common} onClick={onClickShowCountry}>hide</button>
            </div>
            </div>
        ) 
    }
    return (
        <div>
            <button value={country.name.common} onClick={onClickShowCountry}>show</button>
        </div>
    );
}

const Countries = ({foundedCountriesList}) => {

    if (foundedCountriesList.length > 10){
        return <p>Too many matches, specify another filter</p>
    } else if (foundedCountriesList.length >= 1){
        return foundedCountriesList.map((c) => (
            <>
                <p>{c.name.common}</p>
                <Country key={c.name.common} country={c}/>
            </>
        ))
        
    }
    return;
} 
export default Countries;