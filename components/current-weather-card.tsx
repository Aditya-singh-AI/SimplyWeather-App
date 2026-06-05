"use client"

import { Thermometer, Droplets, Wind, Eye, Gauge } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWeatherIcon } from "@/lib/weather-api"
import { useSettings } from "@/hooks/use-settings"
import type { WeatherData } from "@/lib/weather-api"

interface CurrentWeatherCardProps {
  weather: WeatherData["current"]
  location: WeatherData["location"]
}

export function CurrentWeatherCard({ weather, location }: CurrentWeatherCardProps) {
  const { convertTemperature, getTemperatureSymbol } = useSettings()

  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20
  const weatherIcon = getWeatherIcon(weather.weather_code, isDay)

  const displayTemp = convertTemperature(weather.temp)
  const displayFeelsLike = convertTemperature(weather.feels_like)
  const tempSymbol = getTemperatureSymbol()

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="overflow-hidden shadow-2xl border-0 glass-card rounded-2xl">
      {/* Subtle gradient accent at top */}
      <div className="h-1 bg-gradient-to-r from-accent/60 via-purple-400/40 to-blue-500/60" />

      <CardContent className="p-4 sm:p-6 md:p-8">
        {/* Date & time header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{currentDate}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{currentTime}</p>
          </div>
          <Badge
            variant={isDay ? "default" : "secondary"}
            className={`${
              isDay
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20"
            } text-xs font-medium`}
          >
            {isDay ? "☀️ Day" : "🌙 Night"}
          </Badge>
        </div>

        {/* Main temperature display */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Temperature */}
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tighter gradient-text">
                {displayTemp}
              </span>
              <span className="text-xl sm:text-2xl text-muted-foreground font-light">{tempSymbol}</span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-lg sm:text-xl font-semibold capitalize">{weather.weather_description}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent/70" />
                  Feels like {displayFeelsLike}{tempSymbol}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400/70" />
                  {weather.humidity}%
                </span>
              </div>
            </div>
          </div>

          {/* Weather icon */}
          <div className="text-center shrink-0 self-center sm:self-auto">
            <div className="text-6xl sm:text-7xl md:text-8xl animate-float filter drop-shadow-xl select-none">
              {weatherIcon}
            </div>
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-border/30">
          <div className="text-center group rounded-xl p-3 hover:bg-muted/30 transition-all duration-300 cursor-default">
            <div className="flex items-center justify-center mb-1.5">
              <Wind className="h-4 w-4 text-accent/70 group-hover:text-accent transition-colors" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{Math.round(weather.wind_speed)}</p>
            <p className="text-xs text-muted-foreground font-medium">km/h wind</p>
          </div>
          <div className="text-center group rounded-xl p-3 hover:bg-muted/30 transition-all duration-300 cursor-default">
            <div className="flex items-center justify-center mb-1.5">
              <Eye className="h-4 w-4 text-accent/70 group-hover:text-accent transition-colors" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{weather.visibility}</p>
            <p className="text-xs text-muted-foreground font-medium">km visibility</p>
          </div>
          <div className="text-center group rounded-xl p-3 hover:bg-muted/30 transition-all duration-300 cursor-default">
            <div className="flex items-center justify-center mb-1.5">
              <Gauge className="h-4 w-4 text-accent/70 group-hover:text-accent transition-colors" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{weather.pressure}</p>
            <p className="text-xs text-muted-foreground font-medium">hPa pressure</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
