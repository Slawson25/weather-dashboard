const apiKey = 'e1771ec78eaddb0e004639799e82ef77'; 
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const currentContainer = document.querySelector('#current-weather');
const forecastContainer = document.querySelector('#forecast-cards');


searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getCoordinates(city);
        cityInput.value = '';
    }
});


function getCoordinates(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { lat, lon, name } = data[0];
            getWeather(lat, lon, name);
        })
        .catch(err => console.error("City not found"));
}

function getWeather(lat, lon, name) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrent(data.list[0], name);
            displayForecast(data.list);
        });
}

function displayCurrent(weather, cityName) {
    currentContainer.innerHTML = `
        <h2>${cityName} (${new Date().toLocaleDateString()})</h2>
        <p>Temp: ${weather.main.temp} °F</p>
        <p>Wind: ${weather.wind.speed} MPH</p>
        <p>Humidity: ${weather.main.humidity}%</p>
    `;
}

function displayForecast(list) {
    forecastContainer.innerHTML = '';
    for (let i = 7; i < list.length; i += 8) {
        const day = list[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
            <p>Temp: ${day.main.temp} °F</p>
            <p>Hum: ${day.main.humidity}%</p>
        `;
        forecastContainer.appendChild(card);
    }
}