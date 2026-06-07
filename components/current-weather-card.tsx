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

  const getTempColor = (temp: number) => {
    if (temp >= 35) return "temp-hot"
    if (temp >= 25) return "temp-warm"
    if (temp >= 15) return "temp-mild"
    if (temp >= 5) return "temp-cool"
    if (temp >= -5) return "temp-cold"
    return "temp-freezing"
  }

  return (
    <Card className="overflow-hidden shadow-2xl border-0 glass-card rounded-3xl glass-card-glow">
      {/* Gradient accent */}
      <div className="h-1 bg-gradient-to-r from-violet-500/60 via-purple-400/40 to-blue-500/60" />

      <CardContent className="p-5 sm:p-7 md:p-10">
        {/* Date & Badge */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{currentDate}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{currentTime}</p>
          </div>
          <Badge
            variant={isDay ? "default" : "secondary"}
            className={`${
              isDay
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
            } text-xs font-medium px-3 py-1 rounded-full`}
          >
            {isDay ? "☀️ Daytime" : "🌙 Nighttime"}
          </Badge>
        </div>

        {/* Main temp + icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Giant temperature */}
            <div className="flex items-start gap-1">
              <span className={`text-7xl sm:text-8xl md:text-[120px] temp-display ${getTempColor(weather.temp)} animate-counter-up`}>
                {displayTemp}
              </span>
              <span className="text-2xl sm:text-3xl text-muted-foreground font-extralight mt-2 sm:mt-4">{tempSymbol}</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-semibold capitalize">{weather.weather_description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-rose-400/70" />
                  Feels like {displayFeelsLike}{tempSymbol}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400/70" />
                  {weather.humidity}% humidity
                </span>
              </div>
            </div>
          </div>

          {/* Animated weather icon */}
          <div className="weather-icon-container shrink-0 self-center">
            <div className="text-7xl sm:text-8xl md:text-9xl animate-float filter drop-shadow-2xl select-none">
              {weatherIcon}
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 pt-6 border-t border-border/20">
          {[
            { icon: <Wind className="h-4 w-4" />, value: Math.round(weather.wind_speed), unit: "km/h", label: "Wind Speed" },
            { icon: <Eye className="h-4 w-4" />, value: weather.visibility, unit: "km", label: "Visibility" },
            { icon: <Gauge className="h-4 w-4" />, value: weather.pressure, unit: "hPa", label: "Pressure" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center group rounded-2xl p-3 sm:p-4 hover:bg-muted/20 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="text-accent/60 group-hover:text-accent transition-colors">{stat.icon}</div>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground">
                {stat.value}
                <span className="text-xs text-muted-foreground ml-0.5">{stat.unit}</span>
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
