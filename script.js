document.addEventListener('DOMContentLoaded', function() {
  const getWeatherButton = document.getElementById('getWeatherButton');
  const cityInput = document.getElementById('cityInput');
  const weatherDisplay = document.getElementById('weatherDisplay');
  
  
  const API_KEY = 'your_weather_api_key_here';
  
  getWeatherButton.addEventListener('click', function() {
    const city = cityInput.value.trim();
    
    if (city) {
      fetchWeather(city);
    } else {
      weatherDisplay.innerHTML = '<p class="error">Please enter a city name</p>';
    }
  });
  
  function fetchWeather(city) {
    
    weatherDisplay.innerHTML = '<p>Loading weather data...</p>';
    
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Weather data not found');
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data);
      })
      .catch(error => {
        weatherDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      });
  }
  
  function displayWeather(data) {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const city = data.name;
    
    weatherDisplay.innerHTML = `
      <div class="weather-result">
        <h3>${city} Weather</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Conditions: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p class="weather-tip">Tip: ${getWeatherSleepTip(temperature, description)}</p>
      </div>
    `;
  }
  
  function getWeatherSleepTip(temperature, description) {
    // Provide sleep tips based on weather conditions
    if (temperature > 25) {
      return "Hot weather can affect sleep quality. Consider using a fan or light bedding.";
    } else if (temperature < 10) {
      return "Cold weather typically improves sleep quality. Ensure your room is warm enough.";
    } else if (description.includes("rain") || description.includes("drizzle")) {
      return "Rain provides nice background noise for sleep. Consider leaving a window cracked open.";
    } else {
      return "Current weather conditions are moderate - good for sleep quality!";
    }
  }
});
