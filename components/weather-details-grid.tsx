"use client"

import { Wind, Eye, Droplets, Gauge, Thermometer, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/use-settings"
import type { WeatherData } from "@/lib/weather-api"

interface WeatherDetailsGridProps {
  weather: WeatherData["current"]
  airQuality?: WeatherData["air_quality"]
}

function CircularGauge({ value, max, color, size = 44 }: { value: number; max: number; color: string; size?: number }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference - progress * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-muted/40"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="gauge-ring"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function WeatherDetailsGrid({ weather, airQuality }: WeatherDetailsGridProps) {
  const { convertTemperature, getTemperatureSymbol } = useSettings()

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const getAQILevel = (aqi: number) => {
    if (aqi <= 1) return { label: "Good", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" }
    if (aqi <= 2) return { label: "Fair", color: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" }
    if (aqi <= 3) return { label: "Moderate", color: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20" }
    if (aqi <= 4) return { label: "Poor", color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20" }
    return { label: "Very Poor", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20" }
  }

  const detailCards = [
    {
      title: "Wind",
      icon: <Wind className="h-4 w-4" />,
      value: `${Math.round(weather.wind_speed)}`,
      unit: "km/h",
      subtitle: `${getWindDirection(weather.wind_direction)} (${weather.wind_direction}°)`,
      iconColor: "text-sky-500",
      bgColor: "bg-sky-500/10 group-hover:bg-sky-500/20",
      gaugeColor: "#0ea5e9",
      gaugeValue: weather.wind_speed,
      gaugeMax: 100,
    },
    {
      title: "Visibility",
      icon: <Eye className="h-4 w-4" />,
      value: `${weather.visibility}`,
      unit: "km",
      subtitle: weather.visibility >= 10 ? "Excellent" : weather.visibility >= 5 ? "Good" : "Limited",
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
      gaugeColor: "#6366f1",
      gaugeValue: weather.visibility,
      gaugeMax: 15,
    },
    {
      title: "Humidity",
      icon: <Droplets className="h-4 w-4" />,
      value: `${weather.humidity}`,
      unit: "%",
      subtitle: weather.humidity < 30 ? "Low" : weather.humidity < 60 ? "Comfortable" : weather.humidity < 80 ? "High" : "Very High",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
      gaugeColor: "#3b82f6",
      gaugeValue: weather.humidity,
      gaugeMax: 100,
    },
    {
      title: "Pressure",
      icon: <Gauge className="h-4 w-4" />,
      value: `${weather.pressure}`,
      unit: "hPa",
      subtitle: weather.pressure < 1000 ? "Low" : weather.pressure < 1020 ? "Normal" : "High",
      iconColor: "text-violet-500",
      bgColor: "bg-violet-500/10 group-hover:bg-violet-500/20",
      gaugeColor: "#8b5cf6",
      gaugeValue: weather.pressure - 950,
      gaugeMax: 100,
    },
    {
      title: "Feels Like",
      icon: <Thermometer className="h-4 w-4" />,
      value: `${convertTemperature(weather.feels_like)}`,
      unit: getTemperatureSymbol(),
      subtitle:
        Math.abs(weather.feels_like - weather.temp) <= 2
          ? "Similar to actual"
          : weather.feels_like > weather.temp
            ? "Warmer than actual"
            : "Cooler than actual",
      iconColor: "text-rose-500",
      bgColor: "bg-rose-500/10 group-hover:bg-rose-500/20",
      gaugeColor: "#f43f5e",
      gaugeValue: Math.max(convertTemperature(weather.feels_like) + 10, 0),
      gaugeMax: 60,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
      {detailCards.map((card, index) => (
        <Card
          key={card.title}
          className="glass-card border-0 rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-default"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-xl transition-colors ${card.bgColor}`}>
                  <span className={card.iconColor}>{card.icon}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">{card.title}</span>
              </div>
              <CircularGauge value={card.gaugeValue} max={card.gaugeMax} color={card.gaugeColor} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{card.value}</p>
              <span className="text-xs text-muted-foreground">{card.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}

      {/* Air Quality */}
      {airQuality && (
        <Card className="glass-card border-0 rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-default">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Activity className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">Air Quality</span>
              </div>
              <CircularGauge value={airQuality.aqi} max={5} color="#10b981" />
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
