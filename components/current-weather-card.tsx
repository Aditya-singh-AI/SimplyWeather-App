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
    <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-lg font-medium text-foreground">{currentDate}</p>
            <p className="text-sm text-muted-foreground">{currentTime}</p>
          </div>
          <Badge
            variant={isDay ? "default" : "secondary"}
            className={`${isDay ? "bg-amber-500 text-white" : "bg-slate-600 text-white"} animate-pulse-glow`}
          >
            {isDay ? "Day" : "Night"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-8xl font-extralight tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {displayTemp}
              </span>
              <span className="text-3xl text-muted-foreground font-light">{tempSymbol}</span>
            </div>

            <div className="space-y-3">
              <p className="text-2xl font-semibold capitalize text-balance">{weather.weather_description}</p>
              <div className="flex items-center gap-6 text-base text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Feels like {displayFeelsLike}
                  {tempSymbol}
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  {weather.humidity}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-9xl mb-4 animate-float filter drop-shadow-2xl">{weatherIcon}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
          <div className="text-center group hover:bg-muted/50 rounded-lg p-3 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Wind className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(weather.wind_speed)}</p>
            <p className="text-sm text-muted-foreground font-medium">km/h wind</p>
          </div>
          <div className="text-center group hover:bg-muted/50 rounded-lg p-3 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{weather.visibility}</p>
            <p className="text-sm text-muted-foreground font-medium">km visibility</p>
          </div>
          <div className="text-center group hover:bg-muted/50 rounded-lg p-3 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Gauge className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{weather.pressure}</p>
            <p className="text-sm text-muted-foreground font-medium">hPa pressure</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
