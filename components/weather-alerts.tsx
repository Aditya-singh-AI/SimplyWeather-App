"use client"

import { AlertTriangle, Thermometer, Wind, Droplets, Eye, X, CloudRain, Snowflake, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import type { WeatherData } from "@/lib/weather-api"

interface WeatherAlertsProps {
  weather: WeatherData["current"]
  hourly?: WeatherData["hourly"]
}

interface Alert {
  id: string
  type: "danger" | "warning" | "info"
  icon: React.ReactNode
  title: string
  message: string
  gradient: string
}

export function WeatherAlerts({ weather, hourly }: WeatherAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = []

    // Extreme heat
    if (weather.temp >= 40) {
      alerts.push({
        id: "extreme-heat",
        type: "danger",
        icon: <Thermometer className="h-4 w-4" />,
        title: "Extreme Heat Warning",
        message: `Temperature is ${weather.temp}°C. Stay hydrated, avoid outdoor exposure.`,
        gradient: "from-red-500/20 via-orange-500/10 to-transparent",
      })
    } else if (weather.temp >= 35) {
      alerts.push({
        id: "heat-advisory",
        type: "warning",
        icon: <Thermometer className="h-4 w-4" />,
        title: "Heat Advisory",
        message: `High temperature of ${weather.temp}°C expected. Drink plenty of water.`,
        gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      })
    }

    // Extreme cold
    if (weather.temp <= -10) {
      alerts.push({
        id: "extreme-cold",
        type: "danger",
        icon: <Snowflake className="h-4 w-4" />,
        title: "Extreme Cold Warning",
        message: `Temperature is ${weather.temp}°C. Risk of frostbite — limit outdoor exposure.`,
        gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      })
    }

    // High winds
    if (weather.wind_speed >= 60) {
      alerts.push({
        id: "high-wind",
        type: "danger",
        icon: <Wind className="h-4 w-4" />,
        title: "High Wind Warning",
        message: `Wind speeds of ${Math.round(weather.wind_speed)} km/h. Secure outdoor objects.`,
        gradient: "from-slate-500/20 via-gray-500/10 to-transparent",
      })
    } else if (weather.wind_speed >= 40) {
      alerts.push({
        id: "wind-advisory",
        type: "warning",
        icon: <Wind className="h-4 w-4" />,
        title: "Wind Advisory",
        message: `Gusty winds at ${Math.round(weather.wind_speed)} km/h expected.`,
        gradient: "from-slate-400/20 via-gray-400/10 to-transparent",
      })
    }

    // Thunderstorm
    if (weather.weather_code >= 200 && weather.weather_code < 300) {
      alerts.push({
        id: "thunderstorm",
        type: "danger",
        icon: <Zap className="h-4 w-4" />,
        title: "Thunderstorm Alert",
        message: "Active thunderstorm detected. Seek shelter immediately.",
        gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
      })
    }

    // Heavy rain
    if (weather.weather_code >= 502 && weather.weather_code <= 504) {
      alerts.push({
        id: "heavy-rain",
        type: "warning",
        icon: <CloudRain className="h-4 w-4" />,
        title: "Heavy Rain Warning",
        message: "Heavy rainfall in progress. Watch for flooding in low-lying areas.",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      })
    }

    // Low visibility
    if (weather.visibility < 2) {
      alerts.push({
        id: "low-visibility",
        type: "warning",
        icon: <Eye className="h-4 w-4" />,
        title: "Low Visibility Warning",
        message: `Visibility down to ${weather.visibility} km. Drive with caution.`,
        gradient: "from-gray-500/20 via-slate-500/10 to-transparent",
      })
    }

    // Rain coming (from hourly forecast)
    if (hourly && hourly.length > 0) {
      const nextRain = hourly.slice(0, 4).find((h) => h.precipitation_probability > 70)
      if (nextRain) {
        const rainTime = new Date(nextRain.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        alerts.push({
          id: "rain-incoming",
          type: "info",
          icon: <Droplets className="h-4 w-4" />,
          title: "Rain Expected",
          message: `${nextRain.precipitation_probability}% chance of rain around ${rainTime}.`,
          gradient: "from-sky-500/20 via-blue-400/10 to-transparent",
        })
      }
    }

    return alerts
  }

  const alerts = generateAlerts().filter((a) => !dismissedAlerts.includes(a.id))

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [alerts.length])

  if (alerts.length === 0) return null

  const getTypeStyles = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return "border-red-500/30 text-red-400"
      case "warning":
        return "border-amber-500/30 text-amber-400"
      case "info":
        return "border-blue-500/30 text-blue-400"
    }
  }

  return (
    <div
      className={`space-y-2 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          className={`relative overflow-hidden rounded-xl border backdrop-blur-md bg-card/50 ${getTypeStyles(
            alert.type
          )}`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${alert.gradient} pointer-events-none`}
          />

          <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 hidden sm:block" />
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold">{alert.title}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissedAlerts((prev) => [...prev, alert.id])}
              className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
