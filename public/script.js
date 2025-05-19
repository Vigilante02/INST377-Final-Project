const weatherKey = 'b580737b21b8027f4f711418daaba045';
const aqiToken  = '1fb27000e2f6c7806e570ebc4ef83ad98e43c011';

const form = document.getElementById('airForm');
const output = document.getElementById('output');
const saveBtn = document.getElementById('saveBtn');
const favList = document.getElementById('favoritesList');
let currentCity = '';

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;
  currentCity = city;
  output.innerHTML = 'Loading…';

  try {
    const wRes = await fetch(
      `https://api.weatherstack.com/current?access_key=${weatherKey}&query=${city}`
    ).then(r => r.json());

    const aRes = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${aqiToken}`
    ).then(r => r.json());

    const fRes = await fetch('/api/favorites').then(r => r.json());

    output.innerHTML = `
      <h3>${city}</h3>
      <p>Temp: ${wRes.current?.temperature}°C, Humidity: ${wRes.current?.humidity}%</p>
      <p>AQI: ${aRes.data?.aqi ?? 'Unavailable'}</p>
    `;

    renderFavorites(fRes);
    updateChart(aRes.data.aqi);
    updateMap(aRes.data.iaqi?.pm25?.v || aRes.data.aqi);
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Failed to fetch data. Try again later.</p>`;
    console.error(err);
  }
});

saveBtn?.addEventListener('click', async () => {
  if (!currentCity) return alert('Check a city first');
  await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city: currentCity })
  });
  const fRes = await fetch('/api/favorites').then(r => r.json());
  renderFavorites(fRes);
});

function renderFavorites(list) {
  favList.innerHTML = list.map(i => `<li>${i.city}</li>`).join('');
}

const ctx = document.getElementById('aqiChart')?.getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'AQI', data: [] }] },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});
function updateChart(aqi) {
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(aqi);
  chart.update();
}

const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;
function updateMap(val) {
  map.setView([20, 0], 2);
  if (marker) map.removeLayer(marker);
  marker = L.marker([20, 0]).addTo(map).bindPopup(`AQI: ${val}`).openPopup();
}

fetch('/api/favorites')
  .then(r => r.json())
  .then(renderFavorites);
