"use client"

import { Clock, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getWeatherIcon } from "@/lib/weather-api"
import type { WeatherData } from "@/lib/weather-api"

interface HourlyForecastProps {
  hourly: WeatherData["hourly"]
  className?: string
}

export function HourlyForecast({ hourly, className }: HourlyForecastProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit" })
    }
  }

  const isCurrentHour = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    return Math.abs(date.getTime() - now.getTime()) < 30 * 60 * 1000 // Within 30 minutes
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          24-Hour Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {hourly.map((hour, index) => {
              const isNow = isCurrentHour(hour.time)
              const isDay = new Date(hour.time).getHours() >= 6 && new Date(hour.time).getHours() < 20
              const weatherIcon = getWeatherIcon(hour.weather_code, isDay)

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg min-w-[100px] ${
                    isNow ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">{isNow ? "Now" : formatTime(hour.time)}</p>
                    {isNow && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="text-3xl">{weatherIcon}</div>

                  <div className="text-center">
                    <p className="text-lg font-semibold">{hour.temp}°</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    <span>{hour.precipitation_probability}%</span>
                  </div>
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
