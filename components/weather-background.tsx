"use client"

import { useEffect, useState } from "react"

interface WeatherBackgroundProps {
  weatherCode?: number
  isDay?: boolean
}

function getBackgroundClass(weatherCode: number | undefined, isDay: boolean): string {
  if (!weatherCode) return isDay ? "weather-bg-clear-day" : "weather-bg-clear-night"

  if (weatherCode >= 200 && weatherCode < 300) return "weather-bg-stormy"
  if (weatherCode >= 300 && weatherCode < 600) return "weather-bg-rainy"
  if (weatherCode >= 600 && weatherCode < 700) return "weather-bg-snowy"
  if (weatherCode >= 700 && weatherCode < 800) return "weather-bg-cloudy"
  if (weatherCode === 800) return isDay ? "weather-bg-clear-day" : "weather-bg-clear-night"
  return "weather-bg-cloudy"
}

export function WeatherBackground({ weatherCode, isDay = true }: WeatherBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bgClass = getBackgroundClass(weatherCode, isDay)

  return (
    <>
      <div
        className={`weather-bg ${bgClass} transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="weather-ambient" />
    </>
  )
}
