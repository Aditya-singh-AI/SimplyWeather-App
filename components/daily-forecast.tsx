"use client"

import { Calendar, Sunrise, Sunset } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWeatherIcon } from "@/lib/weather-api"
import { useSettings } from "@/hooks/use-settings"
import type { WeatherData } from "@/lib/weather-api"

interface DailyForecastProps {
  daily: WeatherData["daily"]
  className?: string
}

export function DailyForecast({ daily, className }: DailyForecastProps) {
  const { convertTemperature } = useSettings()

  const formatDate = (dateString: string, index: number) => {
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"
    return new Date(dateString).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTempRange = () => {
    const allTemps = daily.flatMap((day) => [convertTemperature(day.temp_max), convertTemperature(day.temp_min)])
    return { min: Math.min(...allTemps), max: Math.max(...allTemps) }
  }

  const tempRange = getTempRange()
  const range = tempRange.max - tempRange.min || 1

  return (
    <Card className={`glass-card border-0 rounded-2xl overflow-hidden ${className}`}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
          <div className="p-1.5 rounded-xl bg-accent/10">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="space-y-1">
          {daily.map((day, index) => {
            const isToday = index === 0
            const weatherIcon = getWeatherIcon(day.weather_code, true)
            const maxTemp = convertTemperature(day.temp_max)
            const minTemp = convertTemperature(day.temp_min)

            const barLeft = ((minTemp - tempRange.min) / range) * 100
            const barRight = 100 - ((maxTemp - tempRange.min) / range) * 100

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl transition-all duration-300 cursor-default ${
                  isToday
                    ? "bg-accent/8 border border-accent/15 shadow-sm"
                    : "hover:bg-muted/20"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon + Date */}
                <div className="flex items-center gap-2.5 min-w-[130px] sm:min-w-[160px] shrink-0">
                  <div className="text-xl sm:text-2xl select-none">{weatherIcon}</div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isToday ? "text-accent" : ""}`}>
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

                {/* Temperature Range Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">{minTemp}°</span>
                    <span className="text-xs sm:text-sm font-bold">{maxTemp}°</span>
                  </div>
                  <div className="relative h-1.5 sm:h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-orange-500 transition-all duration-700"
                      style={{ left: `${barLeft}%`, right: `${barRight}%` }}
                    />
                  </div>
                </div>

                {/* Sunrise/Sunset (desktop) */}
                <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
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
