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
    if (aqi <= 1) return { label: "Good", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" }
    if (aqi <= 2) return { label: "Fair", color: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" }
    if (aqi <= 3) return { label: "Moderate", color: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20" }
    if (aqi <= 4) return { label: "Poor", color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20" }
    return { label: "Very Poor", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20" }
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

  const detailCards = [
    {
      title: "Wind",
      icon: <Wind className="h-4 w-4" />,
      value: `${Math.round(weather.wind_speed)} km/h`,
      subtitle: `${getWindDirection(weather.wind_direction)} (${weather.wind_direction}°)`,
      iconColor: "text-sky-500",
      bgColor: "bg-sky-500/10 group-hover:bg-sky-500/20",
    },
    {
      title: "Visibility",
      icon: <Eye className="h-4 w-4" />,
      value: `${weather.visibility} km`,
      subtitle: weather.visibility >= 10 ? "Excellent" : weather.visibility >= 5 ? "Good" : "Limited",
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    },
    {
      title: "Humidity",
      icon: <Droplets className="h-4 w-4" />,
      value: `${weather.humidity}%`,
      subtitle: getHumidityLevel(weather.humidity),
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
      progress: weather.humidity,
    },
    {
      title: "Pressure",
      icon: <Gauge className="h-4 w-4" />,
      value: `${weather.pressure} hPa`,
      subtitle: getPressureLevel(weather.pressure),
      iconColor: "text-violet-500",
      bgColor: "bg-violet-500/10 group-hover:bg-violet-500/20",
    },
    {
      title: "Feels Like",
      icon: <Thermometer className="h-4 w-4" />,
      value: `${weather.feels_like}°C`,
      subtitle:
        Math.abs(weather.feels_like - weather.temp) <= 2
          ? "Similar to actual"
          : weather.feels_like > weather.temp
            ? "Warmer than actual"
            : "Cooler than actual",
      iconColor: "text-rose-500",
      bgColor: "bg-rose-500/10 group-hover:bg-rose-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
      {detailCards.map((card, index) => (
        <Card
          key={card.title}
          className="glass-card border-0 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-default"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <div className={`p-1 sm:p-1.5 rounded-lg transition-colors ${card.bgColor}`}>
                <span className={card.iconColor}>{card.icon}</span>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{card.title}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground mb-0.5">{card.value}</p>
            {card.progress !== undefined && (
              <div className="mt-1.5 mb-1">
                <Progress value={card.progress} className="h-1.5 rounded-full" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}

      {/* Air Quality */}
      {airQuality && (
        <Card className="glass-card border-0 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Air Quality</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xl font-bold text-foreground">{airQuality.aqi}</p>
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 ${getAQILevel(airQuality.aqi).color}`}>
                {getAQILevel(airQuality.aqi).label}
              </Badge>
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>PM2.5</span>
                <span className="font-medium">{airQuality.pm2_5.toFixed(1)} μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span>PM10</span>
                <span className="font-medium">{airQuality.pm10.toFixed(1)} μg/m³</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
