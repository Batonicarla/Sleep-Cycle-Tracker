// Event listener for form submission
document.getElementById('sleepForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Get user inputs
    const bedtime = document.getElementById('bedtime').value;
    const wakeupTime = document.getElementById('wakeupTime').value;
  
    // Validate inputs
    if (!bedtime || !wakeupTime) {
      alert('Please enter both bedtime and wake-up time.');
      return;
    }
  
    // Calculate sleep duration and quality
    try {
      const sleepData = calculateSleepDuration(bedtime, wakeupTime);
  
      // Display results
      displayResults(sleepData);
    } catch (error) {
      console.error('Error calculating sleep data:', error);
      alert('An error occurred while calculating sleep data.');
    }
  });
  
  /**
   * Function to calculate sleep duration and quality
   * @param {string} bedtime - Bedtime in HH:MM format
   * @param {string} wakeupTime - Wake-up time in HH:MM format
   * @returns {Object} - Sleep data including duration, quality, and recommendations
   */
  function calculateSleepDuration(bedtime, wakeupTime) {
    // Convert times to Date objects
    const bedtimeDate = new Date(`1970-01-01T${bedtime}:00`);
    const wakeupTimeDate = new Date(`1970-01-01T${wakeupTime}:00`);
  
    // Handle cases where bedtime is after midnight
    if (bedtimeDate > wakeupTimeDate) {
      wakeupTimeDate.setDate(wakeupTimeDate.getDate() + 1);
    }
  
    // Calculate sleep duration in hours
    const sleepDurationMs = wakeupTimeDate - bedtimeDate;
    const sleepDurationHours = sleepDurationMs / (1000 * 60 * 60);
  
    // Determine sleep quality
    let sleepQuality = '';
    if (sleepDurationHours >= 8) {
      sleepQuality = 'Excellent';
    } else if (sleepDurationHours >= 6) {
      sleepQuality = 'Good';
    } else {
      sleepQuality = 'Poor';
    }
  
    // Generate recommendations
    let recommendations = '';
    if (sleepDurationHours < 6) {
      recommendations = 'Consider going to bed earlier or reducing screen time before bed.';
    } else if (sleepDurationHours < 8) {
      recommendations = 'You’re doing well, but aim for at least 8 hours of sleep.';
    } else {
      recommendations = 'Great job! Keep maintaining a consistent sleep schedule.';
    }
  
    // Return sleep data as an object
    return {
      sleepDuration: sleepDurationHours.toFixed(2),
      sleepQuality: sleepQuality,
      recommendations: recommendations,
    };
  }
  
  /**
   * Function to display sleep results on the page
   * @param {Object} sleepData - Sleep data object containing duration, quality, and recommendations
   */
  function displayResults(sleepData) {
    const resultsContainer = document.getElementById('results');
  
    // Clear previous results
    resultsContainer.innerHTML = '';
  
    // Create a result card
    const resultCard = document.createElement('div');
    resultCard.classList.add('result-card');
  
    resultCard.innerHTML = `
      <h3>Your Sleep Summary</h3>
      <p><strong>Sleep Duration:</strong> ${sleepData.sleepDuration} hours</p>
      <p><strong>Sleep Quality:</strong> ${sleepData.sleepQuality}</p>
      <p><strong>Recommendations:</strong> ${sleepData.recommendations}</p>
    `;
  
    // Append the result card to the results container
    resultsContainer.appendChild(resultCard);
  }
