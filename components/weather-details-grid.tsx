"use client"

import { Wind, Eye, Droplets, Gauge, Thermometer, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { WeatherData } from "@/lib/weather-api"

interface WeatherDetailsGridProps {
  weather: WeatherData["current"]
  airQuality?: WeatherData["air_quality"]
}

export function WeatherDetailsGrid({ weather, airQuality }: WeatherDetailsGridProps) {
  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const getAQILevel = (aqi: number) => {
    if (aqi <= 1) return { label: "Good", color: "bg-green-500" }
    if (aqi <= 2) return { label: "Fair", color: "bg-yellow-500" }
    if (aqi <= 3) return { label: "Moderate", color: "bg-orange-500" }
    if (aqi <= 4) return { label: "Poor", color: "bg-red-500" }
    return { label: "Very Poor", color: "bg-purple-500" }
  }

  const getHumidityLevel = (humidity: number) => {
    if (humidity < 30) return "Low"
    if (humidity < 60) return "Comfortable"
    if (humidity < 80) return "High"
    return "Very High"
  }

  const getPressureLevel = (pressure: number) => {
    if (pressure < 1000) return "Low"
    if (pressure < 1020) return "Normal"
    return "High"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Wind */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wind</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(weather.wind_speed)} km/h</div>
          <p className="text-xs text-muted-foreground">
            {getWindDirection(weather.wind_direction)} ({weather.wind_direction}°)
          </p>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visibility</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weather.visibility} km</div>
          <p className="text-xs text-muted-foreground">
            {weather.visibility >= 10 ? "Excellent" : weather.visibility >= 5 ? "Good" : "Limited"}
          </p>
        </CardContent>
      </Card>

      {/* Humidity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humidity</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weather.humidity}%</div>
          <div className="mt-2">
            <Progress value={weather.humidity} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{getHumidityLevel(weather.humidity)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Pressure */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pressure</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weather.pressure} hPa</div>
          <p className="text-xs text-muted-foreground">{getPressureLevel(weather.pressure)}</p>
        </CardContent>
      </Card>

      {/* Feels Like */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feels Like</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weather.feels_like}°C</div>
          <p className="text-xs text-muted-foreground">
            {Math.abs(weather.feels_like - weather.temp) <= 2
              ? "Similar to actual"
              : weather.feels_like > weather.temp
                ? "Warmer than actual"
                : "Cooler than actual"}
          </p>
        </CardContent>
      </Card>

      {/* Air Quality */}
      {airQuality && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-bold">{airQuality.aqi}</div>
              <Badge variant="secondary" className={getAQILevel(airQuality.aqi).color}>
                {getAQILevel(airQuality.aqi).label}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>PM2.5:</span>
                <span>{airQuality.pm2_5.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span>PM10:</span>
                <span>{airQuality.pm10.toFixed(1)} μg/m³</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
