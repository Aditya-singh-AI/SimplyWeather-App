"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, TrendingUp, TrendingDown, Droplets, Sun, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WeatherBackground } from "@/components/weather-background"
import { DailyForecast } from "@/components/daily-forecast"
import { ForecastChart } from "@/components/forecast-chart"
import { useWeather } from "@/hooks/use-weather"
import { useSettings } from "@/hooks/use-settings"
import type { UserLocation } from "@/hooks/use-location"

export default function ForecastPage() {
  const router = useRouter()
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("weather-current-location")
    if (saved) {
      try {
        setLocation(JSON.parse(saved))
      } catch {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  if (!location) return null

  return <ForecastContent location={location} mounted={mounted} />
}

function ForecastContent({ location, mounted }: { location: UserLocation; mounted: boolean }) {
  const { weather, loading, error } = useWeather(location.lat, location.lon)
  const { convertTemperature, getTemperatureSymbol } = useSettings()
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WeatherBackground />
        <div className="relative z-10 text-center">
          <div className="text-5xl animate-breathe mb-4">📊</div>
          <p className="text-muted-foreground text-sm">Loading forecast data...</p>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WeatherBackground />
        <div className="relative z-10 glass-card rounded-3xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-foreground">{error || "No data available"}</p>
        </div>
      </div>
    )
  }

  const tempSymbol = getTemperatureSymbol()
  const todayHigh = convertTemperature(weather.daily[0]?.temp_max)
  const todayLow = convertTemperature(weather.daily[0]?.temp_min)
  const maxRainChance = Math.max(...weather.hourly.slice(0, 8).map((h) => h.precipitation_probability))

  return (
    <div className="min-h-screen relative">
      <WeatherBackground weatherCode={weather.current.weather_code} isDay={isDay} />

      <div className="relative z-10 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
          {/* Page Header */}
          <header
            className={`mb-6 sm:mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text">Weather Forecast</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {location.name || `${weather.location.name}, ${weather.location.country}`}
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-5 page-enter">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="glass-card border-0 rounded-2xl group">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <h4 className="font-semibold text-sm">Today's Range</h4>
                  </div>
                  <p className="text-3xl font-extralight tracking-tight">
                    <span className="temp-warm">{todayHigh}°</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="temp-cool">{todayLow}°</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">High / Low</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 rounded-2xl group">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <Droplets className="h-4 w-4 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-sm">Rain Chance</h4>
                  </div>
                  <p className="text-3xl font-extralight tracking-tight">{maxRainChance}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Next 8 hours</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 rounded-2xl group">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                      <Sun className="h-4 w-4 text-orange-500" />
                    </div>
                    <h4 className="font-semibold text-sm">UV Index</h4>
                  </div>
                  <p className="text-3xl font-extralight tracking-tight">{weather.current.uv_index || "N/A"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(weather.current.uv_index || 0) < 3
                      ? "Low"
                      : (weather.current.uv_index || 0) < 6
                        ? "Moderate"
                        : (weather.current.uv_index || 0) < 8
                          ? "High"
                          : "Very High"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Temperature Trend Chart */}
            <div className="animate-slide-up animate-delay-100">
              <ForecastChart hourly={weather.hourly} />
            </div>

            {/* 7-Day Forecast */}
            <div className="animate-slide-up animate-delay-200">
              <DailyForecast daily={weather.daily} />
            </div>
          </div>

          <footer className="text-center py-8 text-xs text-muted-foreground/40 animate-fade-in animate-delay-500">
            <p>SimplyWeather • Made By Aditya Singh With ❤️ and ☕</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
