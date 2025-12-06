// src/api.js
import axios from "axios";

const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
if (!KEY) {
  console.warn("No OpenWeather API key found. Set VITE_OPENWEATHER_API_KEY in .env");
}


const client = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000, // 10s
  headers: { Accept: "application/json" },
});

// cache config
const CACHE_KEY = "gt_openweather_cache_v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes TTL

function now() {
  return Date.now();
}
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read cache:", e);
    return {};
  }
}
function writeCache(obj) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Failed to write cache:", e);
  }
}
function getCityCache(key) {
  const cache = readCache();
  return cache[key] || null;
}
function setCityCache(key, payload) {
  const cache = readCache();
  cache[key] = { ...payload, fetchedAt: now() };
  writeCache(cache);
}
function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * fetchWeatherForCity
 * - city: string (e.g., "London" or "Mumbai")
 * - opts: { force: boolean } — if force = true, ignore valid cache and hit network
 *
 * Returns: { fromCache: boolean, cityKey, current, forecast, fetchedAt }
 * Throws on fatal errors (no cache fallback).
 */
export async function fetchWeatherForCity(city, opts = { force: false }) {
  if (!city || typeof city !== "string") throw new Error("Invalid city");
  const cityKey = city.trim().toLowerCase();

  // try cache first
  if (!opts.force) {
    const cached = getCityCache(cityKey);
    if (cached && now() - (cached.fetchedAt || 0) < CACHE_TTL) {
      return { fromCache: true, cityKey, ...cached };
    }
  }

  // Build requests: current & forecast
  try {
    const params = { q: city, appid: KEY, units: "metric" }; // metric units
    const [curResp, forecastResp] = await Promise.all([
      client.get("/weather", { params }),
      client.get("/forecast", { params }),
    ]);

    const current = curResp.data;
    const forecast = forecastResp.data;

    // Basic validation
    if (!current || !current.weather) throw new Error("Invalid current weather response");
    if (!forecast || !Array.isArray(forecast.list)) throw new Error("Invalid forecast response");

    // Save to cache
    setCityCache(cityKey, { current, forecast });
    return { fromCache: false, cityKey, current, forecast, fetchedAt: now() };
  } catch (err) {
    // On network error or bad response, try to fall back to stale cache
    const cached = getCityCache(cityKey);
    if (cached) {
      return {
        fromCache: true,
        cityKey,
        ...cached,
        warning: `Using cached data due to network/API error: ${err.message}`,
      };
    }
    // If nothing available, rethrow with a friendly message
    let msg = err?.response?.data?.message || err.message || String(err);
    throw new Error(`Failed to fetch city "${city}": ${msg}`);
  }
}

/** Helpers: maintain list of searched cities (recent) */
const CITIES_KEY = "gt_openweather_cities_v1";
export function addSearchedCity(city) {
  if (!city) return;
  try {
    const key = city.trim().toLowerCase();
    const raw = localStorage.getItem(CITIES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    // keep unique, most recent first
    const filtered = [key, ...list.filter((c) => c !== key)].slice(0, 50);
    localStorage.setItem(CITIES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn("Failed to update cities list:", e);
  }
}
export function getSearchedCities() {
  try {
    const raw = localStorage.getItem(CITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
export { clearCache };
