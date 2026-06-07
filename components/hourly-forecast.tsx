"use client"

import { Clock, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWeatherIcon } from "@/lib/weather-api"
import { useSettings } from "@/hooks/use-settings"
import type { WeatherData } from "@/lib/weather-api"

interface HourlyForecastProps {
  hourly: WeatherData["hourly"]
  className?: string
}

export function HourlyForecast({ hourly, className }: HourlyForecastProps) {
  const { convertTemperature } = useSettings()

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { weekday: "short", hour: "2-digit" })
  }

  const isCurrentHour = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    return Math.abs(date.getTime() - now.getTime()) < 30 * 60 * 1000
  }

  // Find min/max for the temperature bar
  const temps = hourly.map((h) => convertTemperature(h.temp))
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const range = maxTemp - minTemp || 1

  return (
    <Card className={`glass-card border-0 rounded-2xl overflow-hidden ${className}`}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
          <div className="p-1.5 rounded-xl bg-accent/10">
            <Clock className="h-4 w-4 text-accent" />
          </div>
          24-Hour Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5 px-2 sm:px-4">
        <div className="scroll-container px-2">
          {hourly.map((hour, index) => {
            const isNow = isCurrentHour(hour.time)
            const isDay = new Date(hour.time).getHours() >= 6 && new Date(hour.time).getHours() < 20
            const weatherIcon = getWeatherIcon(hour.weather_code, isDay)
            const temp = convertTemperature(hour.temp)
            const tempPercent = ((temp - minTemp) / range) * 100

            return (
              <div
                key={index}
                className={`scroll-item flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[80px] transition-all duration-300 hover:scale-105 cursor-default ${
                  isNow
                    ? "bg-accent/12 border border-accent/25 shadow-lg shadow-accent/10 ring-1 ring-accent/10"
                    : "bg-muted/20 hover:bg-muted/40"
                }`}
                style={{ animationDelay: `${index * 25}ms` }}
              >
                {/* Time */}
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isNow ? "text-accent" : "text-muted-foreground"}`}>
                    {isNow ? "Now" : formatTime(hour.time)}
                  </p>
                  {isNow && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto mt-1 animate-pulse shadow-sm shadow-accent/50" />
                  )}
                </div>

                {/* Icon */}
                <div className="text-2xl select-none">{weatherIcon}</div>

                {/* Temperature with mini bar */}
                <div className="text-center">
                  <p className={`text-sm font-bold ${isNow ? "text-accent" : ""}`}>
                    {temp}°
                  </p>
                  {/* Mini temperature bar */}
                  <div className="w-8 h-1 rounded-full bg-muted/40 mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400 transition-all duration-500"
                      style={{ width: `${Math.max(tempPercent, 10)}%` }}
                    />
                  </div>
                </div>

                {/* Precipitation */}
                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Droplets className="h-2.5 w-2.5 text-blue-400/70" />
                  <span>{hour.precipitation_probability}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
