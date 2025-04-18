document.addEventListener('DOMContentLoaded', function() {
  
  const sleepForm = document.getElementById('sleepForm');
  const bedtimeInput = document.getElementById('bedtime');
  const wakeupTimeInput = document.getElementById('wakeupTime');
  const resultsSection = document.getElementById('results');
  
  
  const getWeatherButton = document.getElementById('getWeatherButton');
  const cityInput = document.getElementById('cityInput');
  const weatherDisplay = document.getElementById('weatherDisplay');
  
  
  sleepForm.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateSleep();
  });
  
  
  function calculateSleep() {
    
    const bedtime = bedtimeInput.value;
    const wakeupTime = wakeupTimeInput.value;
    
    if (!bedtime || !wakeupTime) {
      alert('Please enter both bedtime and wake-up time');
      return;
    }
    

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    
    const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeupTime.split(':').map(Number);
    
    
    const bedtimeDate = new Date(today);
    bedtimeDate.setHours(bedHours, bedMinutes, 0);
    
    let wakeupTimeDate = new Date(today);
    wakeupTimeDate.setHours(wakeHours, wakeMinutes, 0);
    
    
    if (wakeupTimeDate <= bedtimeDate) {
      wakeupTimeDate = new Date(tomorrow);
      wakeupTimeDate.setHours(wakeHours, wakeMinutes, 0);
    }

    const sleepDuration = wakeupTimeDate - bedtimeDate;
    
    
    const hours = Math.floor(sleepDuration / (1000 * 60 * 60));
    const minutes = Math.floor((sleepDuration % (1000 * 60 * 60)) / (1000 * 60));
    
    
    const cycles = Math.round(sleepDuration / (1000 * 60 * 90));
    
    
    
    let quality = 0;
    const totalHours = hours + (minutes / 60);
    
    if (totalHours >= 7 && totalHours <= 9) {
      quality = 100;
    } else if (totalHours > 9) {
      quality = Math.max(70, 100 - ((totalHours - 9) * 10));
    } else if (totalHours < 7) {
      quality = Math.max(50, 84 + ((totalHours - 7) * 12));
    }
    

    displayResults(hours, minutes, cycles, Math.round(quality), totalHours);
  }
  
  
  function displayResults(hours, minutes, cycles, quality, totalHours) {
    
    document.getElementById('totalHours').textContent = `${hours}h ${minutes}m`;
    document.getElementById('cycles').textContent = cycles;
    document.getElementById('quality').textContent = `${quality}%`;
    
    
    resultsSection.classList.add('active');
    
    
    const adviceElement = document.createElement('div');
    adviceElement.className = 'sleep-advice';
    adviceElement.innerHTML = `
      <h3>Sleep Advice</h3>
      <p>${getSleepAdvice(totalHours)}</p>
    `;
    
    
    const existingAdvice = resultsSection.querySelector('.sleep-advice');
    if (existingAdvice) {
      existingAdvice.remove();
    }
    
    resultsSection.querySelector('.results-card').appendChild(adviceElement);
    

    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }
  

  function getSleepAdvice(hours) {
    if (hours < 5) {
      return "You're getting significantly less sleep than recommended. Lack of sleep can impair cognitive function and weaken your immune system. Try to prioritize your sleep schedule and aim for 7-9 hours.";
    } else if (hours < 7) {
      return "You're getting less than the recommended amount of sleep. Most adults need 7-9 hours for optimal health. Consider going to bed earlier or adjusting your schedule to get more rest.";
    } else if (hours >= 7 && hours <= 9) {
      return "Great job! You're getting the ideal amount of sleep for an adult. Keep maintaining this healthy sleep schedule for optimal physical and mental well-being.";
    } else if (hours > 9 && hours <= 10) {
      return "You're sleeping slightly more than the typical recommendation. While some people naturally need more sleep, excessive sleep can sometimes indicate other health issues. Monitor how you feel during the day.";
    } else {
      return "You're sleeping significantly more than the typical recommendation. While occasionally catching up on sleep is normal, consistently sleeping more than 10 hours might warrant checking with a healthcare provider.";
    }
  }
  

  if (getWeatherButton) {
    getWeatherButton.addEventListener('click', function() {
      const city = cityInput.value.trim();
      if (!city) {
        alert('Please enter a city name');
        return;
      }
      
    
      const API_KEY = 'your_weather_api_key_here';
      
      weatherDisplay.innerHTML = '<p>Loading weather data...</p>';
      
      
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('City not found');
          }
          return response.json();
        })
        .then(data => {
          const temp = data.main.temp;
          const weather = data.weather[0].description;
          const humidity = data.main.humidity;
          
          weatherDisplay.innerHTML = `
            <div class="weather-result">
              <h3>${city} Weather</h3>
              <div class="weather-info">
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Conditions:</strong> ${weather}</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
              </div>
              <div class="weather-tip">
                ${getWeatherSleepTip(temp, weather)}
              </div>
            </div>
          `;
        })
        .catch(error => {
          weatherDisplay.innerHTML = `<p style="color: #d9534f;">Error: ${error.message}</p>`;
        });
    });
  }
  
  
  function getWeatherSleepTip(temperature, weatherCondition) {
    if (temperature > 25) {
      return "Tip: High temperatures can disrupt sleep. Consider using a fan, air conditioning, or lightweight bedding for better sleep quality.";
    } else if (temperature < 10) {
      return "Tip: Cold temperatures often promote better sleep. Make sure your room is comfortably warm with appropriate bedding.";
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      return "Tip: Rainy conditions can provide calming background noise for sleep. Consider cracking a window to hear the rain or use a sound machine if you find it soothing.";
    } else if (weatherCondition.includes('clear')) {
      return "Tip: Clear skies can mean more natural light in the morning. Consider using blackout curtains if you want to sleep in, or leave them open to help your body wake naturally with the sun.";
    } else {
      return "Tip: Current weather conditions are moderate - typically good for quality sleep. Maintain a comfortable room temperature between 18-20°C (65-68°F) for optimal rest.";
    }
  }
});
     
  
