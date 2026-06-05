"use client"

import { Calendar, Sunrise, Sunset } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getWeatherIcon } from "@/lib/weather-api"
import type { WeatherData } from "@/lib/weather-api"

interface DailyForecastProps {
  daily: WeatherData["daily"]
  className?: string
}

export function DailyForecast({ daily, className }: DailyForecastProps) {
  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"

    return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTempRange = () => {
    const allTemps = daily.flatMap((day) => [day.temp_max, day.temp_min])
    return {
      min: Math.min(...allTemps),
      max: Math.max(...allTemps),
    }
  }

  const tempRange = getTempRange()

  return (
    <Card className={`glass-card border-0 rounded-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {daily.map((day, index) => {
            const isToday = index === 0
            const weatherIcon = getWeatherIcon(day.weather_code, true)

            return (
              <div
                key={index}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 cursor-default ${
                  isToday
                    ? "bg-accent/8 border border-accent/15"
                    : "hover:bg-muted/30"
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Date and Weather Icon */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-xl sm:text-2xl select-none">{weatherIcon}</div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-medium truncate ${isToday ? "text-accent" : ""}`}>
                      {formatDate(day.date, index)}
                      {isToday && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent ml-1.5 animate-pulse" />
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="text-blue-400/70">💧</span>
                      <span>{day.precipitation_probability}%</span>
                    </div>
                  </div>
                </div>

                {/* Temperature Range */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-bold">{day.temp_max}°</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">{day.temp_min}°</span>
                  </div>
                  <div className="relative h-1 sm:h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    {/* Temperature range bar */}
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-accent to-orange-400"
                      style={{
                        left: `${((day.temp_min - tempRange.min) / (tempRange.max - tempRange.min)) * 100}%`,
                        right: `${100 - ((day.temp_max - tempRange.min) / (tempRange.max - tempRange.min)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Sunrise/Sunset (desktop only) */}
                <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Sunrise className="h-3 w-3 text-amber-500/70" />
                    <span>{formatTime(day.sunrise)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunset className="h-3 w-3 text-orange-500/70" />
                    <span>{formatTime(day.sunset)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
