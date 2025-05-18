async function validateAndFetchData() {
    const city = document.getElementById('cityInput').value.trim();
    const output = document.getElementById('output');
  
    // Validation
    const validationRegex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
    if (city === "" || validationRegex.test(city)) {
      document.body.style.backgroundColor = 'orange';
      alert("Please enter a valid city name.");
      return false;
    }
  
    // Reset UI
    output.innerHTML = '';
    document.body.style.backgroundColor = 'white';
  
    await getAirQuality(city);
    await getWeather(city);
  
    return false; // Prevent form submission
  }
  
  async function getAirQuality(city) {
    const token = 'your_aqicn_token_here';
    const url = `https://api.waqi.info/feed/${city}/?token=${token}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "ok") {
        const aqi = data.data.aqi;
        const status = getAQIStatus(aqi);
  
        document.getElementById('output').innerHTML += `
          <h3>AQI for ${data.data.city.name}</h3>
          <p><strong>AQI:</strong> ${aqi}</p>
          <p><strong>Status:</strong> ${status}</p>
        `;
  
        // Background color logic
        if (aqi <= 50) document.body.style.backgroundColor = 'lightgreen';
        else if (aqi <= 100) document.body.style.backgroundColor = 'khaki';
        else if (aqi <= 150) document.body.style.backgroundColor = 'orange';
        else document.body.style.backgroundColor = 'lightcoral';
  
      } else {
        document.getElementById('output').innerHTML += "<p>Error fetching AQI data.</p>";
      }
    } catch (error) {
      document.getElementById('output').innerHTML += "<p>Error fetching AQI data.</p>";
    }
  }
  
  function getAQIStatus(aqi) {
    if (aqi <= 50) return '<span style="color:green">Good</span>';
    else if (aqi <= 100) return '<span style="color:goldenrod">Moderate</span>';
    else if (aqi <= 150) return '<span style="color:orange">Unhealthy for Sensitive Groups</span>';
    else return '<span style="color:red">Unhealthy</span>';
  }
  
  async function getWeather(city) {
    const weatherKey = 'your_weatherstack_key_here';
    const url = `http://api.weatherstack.com/current?access_key=${weatherKey}&query=${city}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.success) {
        document.getElementById('output').innerHTML += "<p>Error fetching weather data.</p>";
        return;
      }
  
      const weather = data.current;
      document.getElementById('output').innerHTML += `
        <h3>Weather in ${data.location.name}</h3>
        <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
        <p><strong>Condition:</strong> ${weather.weather_descriptions[0]}</p>
        <p><strong>Humidity:</strong> ${weather.humidity}%</p>
      `;
    } catch (error) {
      document.getElementById('output').innerHTML += "<p>Error fetching weather data.</p>";
    }
  }
  
