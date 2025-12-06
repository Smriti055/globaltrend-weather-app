// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWeatherForCity, addSearchedCity, getSearchedCities, clearCache } from "../api";
import WeatherSummary from "../components/WeatherSummary";

export default function Home() {
  const [q, setQ] = useState("");
  const [loadingCity, setLoadingCity] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const [recent, setRecent] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [humidityMax, setHumidityMax] = useState("");
  const [limit, setLimit] = useState(12);

  const navigate = useNavigate();

  useEffect(() => {
    const r = getSearchedCities();
    setRecent(r);
    // load cached summaries
    (async () => {
      const items = [];
      for (const c of r) {
        try {
          const res = await fetchWeatherForCity(c, { force: false });
          items.push({ cityKey: res.cityKey, current: res.current, fetchedAt: res.fetchedAt, warning: res.warning });
        } catch (e) {
          // ignore
        }
      }
      setSummaries(items);
    })();
  }, []);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!q) return;
    setLoadingCity(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetchWeatherForCity(q, { force: false });
      addSearchedCity(q);
      const updated = [res.cityKey, ...getSearchedCities().filter(k => k !== res.cityKey)];
      setRecent(updated);
      setSummaries(prev => [{ cityKey: res.cityKey, current: res.current, fetchedAt: res.fetchedAt, warning: res.warning }, ...prev.filter(p => p.cityKey !== res.cityKey)]);
      if (res.warning) setWarning(res.warning);
      navigate(`/city/${res.cityKey}`);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoadingCity(false);
    }
  }

  function applyFilters(items) {
    let out = items.slice();
    if (tempMin !== "") out = out.filter(i => (i.current?.main?.temp ?? -999) >= Number(tempMin));
    if (tempMax !== "") out = out.filter(i => (i.current?.main?.temp ?? 999) <= Number(tempMax));
    if (humidityMax !== "") out = out.filter(i => (i.current?.main?.humidity ?? 999) <= Number(humidityMax));
    if (limit && Number(limit) > 0) out = out.slice(0, Number(limit));
    return out;
  }

  const displayed = applyFilters(summaries);

  return (
    <div>
      <div className="bg-gradient-to-r from-white to-sky-50 rounded-xl p-6 shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 items-center">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Search city (e.g., London, Mumbai)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" disabled={loadingCity}>
            {loadingCity ? "Searching..." : "Search"}
          </button>
          <button type="button" onClick={() => { setQ(""); setError(null); }} className="ml-2 text-sm text-gray-600">Clear</button>
        </form>
        {error && <div className="mt-3 text-red-600">{error}</div>}
        {warning && <div className="mt-3 text-yellow-700">{warning}</div>}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <input placeholder="Temp ≥" value={tempMin} onChange={e=>setTempMin(e.target.value)} className="border rounded px-2 py-1 w-24" type="number" />
            <input placeholder="Temp ≤" value={tempMax} onChange={e=>setTempMax(e.target.value)} className="border rounded px-2 py-1 w-24" type="number" />
            <input placeholder="Hum ≤" value={humidityMax} onChange={e=>setHumidityMax(e.target.value)} className="border rounded px-2 py-1 w-24" type="number" />
            <input placeholder="Limit" value={limit} onChange={e=>setLimit(e.target.value)} className="border rounded px-2 py-1 w-20" type="number" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => { clearCache(); setSummaries([]); setRecent([]); }} className="px-3 py-1 bg-gray-200 rounded text-sm">Clear Cache</button>
            <button onClick={async ()=> {
              const items = [];
              for (const c of getSearchedCities()) {
                try {
                  const res = await fetchWeatherForCity(c, { force: true });
                  items.push({ cityKey: res.cityKey, current: res.current, fetchedAt: res.fetchedAt, warning: res.warning });
                } catch (e) {}
              }
              setSummaries(items);
            }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Refresh All</button>
          </div>
        </div>
      </div>

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Recent / Saved Cities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayed.length === 0 && <div className="text-sm text-gray-500">No cities yet — search to add one.</div>}
          {displayed.map(item => (
            <Link to={`/city/${item.cityKey}`} key={item.cityKey} className="block">
              <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow flex items-center gap-4 hover:shadow-lg transition">
                <WeatherSummary current={item.current} fetchedAt={item.fetchedAt} small />
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">{item.current?.sys?.country}</div>
                  <div className="text-sm text-gray-600">{item.current?.weather?.[0]?.main}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.fetchedAt ? new Date(item.fetchedAt).toLocaleString() : ""}</div>
                  {item.warning && <div className="text-xs text-yellow-700 mt-1">{item.warning}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
