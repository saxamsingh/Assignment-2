const API_KEY = "63d1b39bd375d86da68e6740e4736d3f";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const cityInput = document.getElementById("cityInput");

let searchHistory = JSON.parse(localStorage.getItem("weatherSearches")) || [];

async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
  );
  if (!res.ok) {
    alert("City not found. Please check the name.");
    throw new Error("City not found");
  }
  const data = await res.json();
  return data;
}

document.getElementById("searchBtn").onclick = () => {
  const city = cityInput.value.trim();
  if (city) {
    search(city);
  }
};

function renderWeather(d) {
  weatherBox.innerHTML = `
                <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
                <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
                <div class="weather-item"><label>Condition</label><span>${d.weather[0].main}</span></div>
                <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
                <div class="weather-item"><label>Wind</label><span>${d.wind.speed} m/s</span></div>
            `;
}

function saveHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.unshift(city);
    if (searchHistory.length > 6) {
      searchHistory.pop();
    }
    localStorage.setItem("weatherSearches", JSON.stringify(searchHistory));
  }
  showHistory();
}

function showHistory() {
  if (searchHistory.length === 0) {
    historyBox.innerHTML = '<p style="color:#666;">No searches yet</p>';
    return;
  }

  let html = "";
  searchHistory.forEach((city) => {
    html += `<button class="history-btn" onclick="search('${city}')">${city}</button>`;
  });
  historyBox.innerHTML = html;
}

async function search(city) {
  weatherBox.innerHTML = '<p style="color:#666;">Loading...</p>';
  try {
    const data = await getWeather(city);
    renderWeather(data);
    saveHistory(data.name);
    cityInput.value = "";
  } catch (error) {
    weatherBox.innerHTML = `<p style="color:#ff4d4f;"> ${error.message}</p>`;
  }
}

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      search(city);
    }
  }
});

showHistory();
