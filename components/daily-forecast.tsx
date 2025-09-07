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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daily.map((day, index) => {
            const isToday = index === 0
            const weatherIcon = getWeatherIcon(day.weather_code, true)

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  isToday ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                }`}
              >
                {/* Date and Weather Icon */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="text-3xl">{weatherIcon}</div>
                  <div>
                    <p className="font-medium">
                      {formatDate(day.date, index)}
                      {isToday && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Today
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{day.precipitation_probability}% chance of rain</p>
                  </div>
                </div>

                {/* Temperature Range */}
                <div className="flex-1 min-w-[120px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">{day.temp_max}°</span>
                    <span className="text-lg text-muted-foreground">{day.temp_min}°</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={((day.temp_max - tempRange.min) / (tempRange.max - tempRange.min)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Sunrise className="h-4 w-4" />
                    <span>{formatTime(day.sunrise)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunset className="h-4 w-4" />
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
