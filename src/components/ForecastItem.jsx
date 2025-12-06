// src/components/ForecastItem.jsx
import React from "react";

export default function ForecastItem({ f }) {
  const time = new Date(f.dt * 1000);
  const icon = f.weather?.[0]?.icon;
  return (
    <div className="min-w-[700px] bg-white/90 backdrop-blur rounded-lg shadow px-4 py-3 flex flex-col items-start gap-2">
      <div className="text-xs text-gray-500">{time.toLocaleString()}</div>
      <div className="flex items-center gap-3">
        {icon && <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="" className="w-10 h-10"/>}
        <div>
          <div className="text-sm font-medium">{f.weather?.[0]?.main}</div>
          <div className="text-xs text-gray-500">{f.weather?.[0]?.description}</div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">Temp: {f.main?.temp} °C</div>
      <div className="text-xs text-gray-500">Hum: {f.main?.humidity}%</div>
    </div>
  );
}
