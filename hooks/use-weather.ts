"use client"

import { useState, useEffect } from "react"
import { type WeatherData, getCurrentWeather } from "@/lib/weather-api"

export function useWeather(lat?: number, lon?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getCurrentWeather(latitude, longitude)
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      fetchWeather(lat, lon)
    }
  }, [lat, lon])

  return {
    weather,
    loading,
    error,
    refetch: lat !== undefined && lon !== undefined ? () => fetchWeather(lat, lon) : undefined,
  }
}
