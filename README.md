**GLOBAL TREND — OpenWeather API Integration (React + Tailwind)**

A modern weather dashboard built using React (Vite), Tailwind CSS, and the OpenWeather REST API.
This project fulfills the API Integration Internship assignment requirements: fetching data from public APIs, caching, error handling, clean UI, and properly documented code.

**📸 Screenshots**

public/Home.png — Home page

public/Details.png — City details + forecast timeline

public/Filter.png - Filter functionality in home page

**🚀 Features**

**✔️ API Integration**

Fetches Current Weather

Fetches 5-Day / 3-Hour Forecast

Uses the real OpenWeather public REST API

Fully handles JSON responses, status codes & network errors

**✔️ Caching**

Caches city-wise weather data in localStorage

Cache TTL = 30 minutes

Automatically uses cached data when:

API rate limit hits

Network is offline

API is slow or unreachable

**✔️ City List & Filters**

Saves searched cities

Filters:

Temperature ≥ (°C)

Temperature ≤ (°C)

Humidity ≤ (%)

Limit (max number of items)

**✔️ Detail View (Single Item)**

City details page includes:

Current temperature & weather card

Weather description

Wind, humidity, pressure

Sunrise, sunset, visibility

5-day forecast (horizontal scroll timeline)

**✔️ UI/UX**

Built with React + Tailwind

Weather-app modern design

Responsive layout

Error messages & warnings visible to the user

**📂 Project Structure**

project-root/<br>
├─ README.md<br>
├─ index.html<br>
├─ package.json<br>
├─ .gitignore<br>
├─ .env (not committed)<br>
├─ src/<br>
│  ├─ api.js <br>               # API + caching logic
│  ├─ App.jsx<br>
│  ├─ main.jsx<br>
│  ├─ index.css<br>
│  ├─ components/<br>
│  │  ├─ WeatherSummary.jsx<br>
│  │  └─ ForecastItem.jsx<br>
│  └─ pages/<br>
│     ├─ Home.jsx<br>
│     └─ Details.jsx<br>

**🛠️ Tech Used**

React (Vite)

Tailwind CSS

Axios (with 10s timeout)

React Router

OpenWeather REST API

**🔑 API Endpoints Used**
Current Weather
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric

Forecast (5-Day / 3-Hour)
GET https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric


Both implemented inside src/api.js with proper error handling.

**⚙️ Installation & Running the Project**
*1. Clone the repository*<br>
git clone your-repo-url
cd your-repo-folder

*2. Install dependencies*<br>
npm install<br>

*3. Add your API key*<br>
Create a .env file in the root:<br>
VITE_OPENWEATHER_API_KEY=your_api_key_here

Do not commit .env — it’s already in .gitignore.

*4. Start development server*<br>
npm run dev

Visit → http://localhost:5173

**🧠 How Caching Works**

Cache stored under key:gt_openweather_cache_v1

Structure:
{
  "delhi": {
    "current": {...},
    "forecast": {...},
    "fetchedAt": 1710000000000
  }
}

Cache TTL: 30 minutes

**Cache Use Logic**

If cached data exists and is fresh → return it

If API fails but cache exists → return cached data + show warning

If cache doesn’t exist and API fails → show error

**🧪 Error Handling**

Invalid city

Invalid API key

Network offline

Timeout (10s using Axios)

Forecast or weather missing fields

All errors are shown to the user clearly.

📊 Filters in Home Page

**Filters applied on saved/recent cities:**

Temp ≥ (tempMin)

Temp ≤ (tempMax)

Humidity ≤ (humidityMax)

Limit (max results)

These filters work dynamically based on cached weather data.


**This project successfully demonstrates API integration, caching, filtering, error handling, and UI development as required by the GLOBAL TREND internship assignment.**
