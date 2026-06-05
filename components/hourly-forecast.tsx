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
    <Card className={`glass-card border-0 rounded-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Clock className="h-4 w-4 text-accent" />
          </div>
          24-Hour Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-3">
            {hourly.map((hour, index) => {
              const isNow = isCurrentHour(hour.time)
              const isDay = new Date(hour.time).getHours() >= 6 && new Date(hour.time).getHours() < 20
              const weatherIcon = getWeatherIcon(hour.weather_code, isDay)

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl min-w-[85px] transition-all duration-300 hover:scale-105 cursor-default ${
                    isNow
                      ? "bg-accent/10 border border-accent/20 shadow-lg shadow-accent/5"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isNow ? "text-accent" : ""}`}>
                      {isNow ? "Now" : formatTime(hour.time)}
                    </p>
                    {isNow && (
                      <div className="w-1 h-1 rounded-full bg-accent mx-auto mt-1 animate-pulse" />
                    )}
                  </div>

                  <div className="text-2xl select-none">{weatherIcon}</div>

                  <p className={`text-sm font-bold ${isNow ? "text-accent" : ""}`}>
                    {hour.temp}°
                  </p>

                  <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Droplets className="h-2.5 w-2.5 text-blue-400/70" />
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
