// src/components/WeatherSummary.jsx
import React from "react";

export default function WeatherSummary({ current, fetchedAt, small = false }) {
  if (!current) return null;

  const icon = current.weather?.[0]?.icon;
  const desc = current.weather?.[0]?.description;
  const name = current.name;
  const country = current.sys?.country;
  const temp = current.main?.temp;
  const feels = current.main?.feels_like;
  const humidity = current.main?.humidity;
  const wind = current.wind?.speed;

  return (
    <div className={`bg-white/80 backdrop-blur rounded-xl shadow-md p-5 ${small ? "flex items-center gap-4" : ""}`}>
      {!small && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="text-sm text-gray-500"> {name} — {country}</div>
            <div className="mt-2 text-xs text-gray-400">As of: {fetchedAt ? new Date(fetchedAt).toLocaleString() : new Date(current.dt * 1000).toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-4">
              {icon && (
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} className="w-20 h-20"/>
              )}
              <div>
                <div className="text-4xl font-bold">{temp?.toFixed(1)}°C</div>
                <div className="text-sm text-gray-600">Feels like {feels?.toFixed(1)}°C</div>
                <div className="mt-2 text-sm text-gray-600">{current.weather?.[0]?.main} — {desc}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Temperature</div>
              <div className="text-lg font-medium">{temp?.toFixed(2)} °C</div>
              <div className="text-sm text-gray-600">Feels like {feels?.toFixed(2)} °C</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Conditions</div>
              <div className="text-lg font-medium">{current.weather?.[0]?.main}</div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">Wind</div>
                <div className="text-sm text-gray-700">{wind ?? "—"} m/s</div>

                <div className="text-sm text-gray-500 mt-2">Humidity</div>
                <div className="text-sm text-gray-700">{humidity ?? "—"}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {small && (
        <>
          {icon && <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} className="w-14 h-14"/>}
          <div>
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-lg font-bold">{temp?.toFixed(1)}°C</div>
            <div className="text-xs text-gray-500">Hum: {humidity}% • {current.weather?.[0]?.main}</div>
          </div>
        </>
      )}
    </div>
  );
}
