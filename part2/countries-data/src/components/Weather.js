
// import { useState } from "react";

const Weather = ({info}) => {
    console.log(info)

    const iconURL = `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`

    return (
        <div>
        <h2>Weather in {info.name}</h2>
        <p>temperature {info.main.temp} Celcius</p>
        <img src={iconURL} alt="weather icon" />
        <p>wind {info.wind.speed} m/s</p>
        </div>
    )
}
export default Weather;