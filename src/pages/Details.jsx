// src/pages/Details.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchWeatherForCity } from "../api";
import WeatherSummary from "../components/WeatherSummary";
import ForecastItem from "../components/ForecastItem";

export default function Details() {
  const { cityKey } = useParams();
  const [data, setData] = useState({ current: null, forecast: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchWeatherForCity(cityKey, { force: false })
      .then(res => {
        if (!mounted) return;
        setData({ current: res.current, forecast: res.forecast });
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));
    return () => mounted = false;
  }, [cityKey]);

  if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
  if (error) return <div><div className="text-red-600">Error: {error}</div><Link to="/" className="text-blue-600">Back</Link></div>;

  const { current, forecast } = data;
  return (
    <div className="space-y-6">
      <WeatherSummary current={current} fetchedAt={current?.dt ? current.dt * 1000 : null} />

      <div>
        <h3 className="text-lg font-semibold mb-3">5-day forecast (3-hour intervals)</h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="flex gap-3">
            {forecast?.list?.map(f => (
              <div key={f.dt} className="flex-shrink-0">
                <ForecastItem f={f} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Detailed info</h3>
        <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Coordinates</div>
              <div className="text-sm">{current?.coord?.lat}, {current?.coord?.lon}</div>

              <div className="mt-3 text-sm text-gray-500">Sunrise / Sunset</div>
              <div className="text-sm">{new Date((current?.sys?.sunrise||0)*1000).toLocaleTimeString()} / {new Date((current?.sys?.sunset||0)*1000).toLocaleTimeString()}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Pressure</div>
              <div className="text-sm">{current?.main?.pressure} hPa</div>

              <div className="mt-3 text-sm text-gray-500">Visibility</div>
              <div className="text-sm">{current?.visibility ?? "—"} m</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Link to="/" className="text-blue-600 font-semibold">← Back to list</Link>
      </div>
    </div>
  );
}
