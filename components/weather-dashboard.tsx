"use client"

import { RefreshCw, MapPin, TrendingUp, Settings, Star, Sun, Moon, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrentWeatherCard } from "@/components/current-weather-card"
import { WeatherDetailsGrid } from "@/components/weather-details-grid"
import { HourlyForecast } from "@/components/hourly-forecast"
import { DailyForecast } from "@/components/daily-forecast"
import { ForecastChart } from "@/components/forecast-chart"
import { SunriseSunset } from "@/components/sunrise-sunset"
import { WeatherAlerts } from "@/components/weather-alerts"
import { WeatherMap } from "@/components/weather-map"
import { useWeather } from "@/hooks/use-weather"
import { useSettings } from "@/hooks/use-settings"
import { useTheme } from "next-themes"
import type { UserLocation } from "@/hooks/use-location"

interface WeatherDashboardProps {
  location: UserLocation
  onSettingsClick?: () => void
}

export function WeatherDashboard({ location, onSettingsClick }: WeatherDashboardProps) {
  const { weather, loading, error, refetch } = useWeather(location.lat, location.lon)
  const { convertTemperature, getTemperatureSymbol, toggleTemperatureUnit } = useSettings()
  const { theme, setTheme } = useTheme()

  if (loading) {
    return <WeatherDashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card rounded-2xl p-8 max-w-md text-center animate-scale-in">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-foreground font-medium mb-3">{error}</p>
          {refetch && (
            <Button size="sm" variant="outline" onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No weather data available</p>
      </div>
    )
  }

  const lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const getWeatherBackground = (weatherCode: number) => {
    if (weatherCode >= 200 && weatherCode < 300) return "weather-rainy"
    if (weatherCode >= 300 && weatherCode < 600) return "weather-rainy"
    if (weatherCode >= 600 && weatherCode < 700) return "weather-snowy"
    if (weatherCode >= 700 && weatherCode < 800) return "weather-cloudy"
    if (weatherCode === 800) return "weather-clear"
    return "weather-cloudy"
  }

  const weatherBg = getWeatherBackground(weather.current.weather_code)

  return (
    <div className="min-h-screen">
      <div className={`fixed inset-0 ${weatherBg} opacity-[0.04] -z-10`} />

      <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
        {/* Location header */}
        <div className="flex items-start sm:items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-accent/10 border border-accent/20 shrink-0">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight gradient-text truncate">
                {location.name || `${weather.location.name}, ${weather.location.country}`}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 sm:mt-1">
                {location.isCurrentLocation && (
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent border-accent/20 text-xs"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Current Location
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Updated {lastUpdated}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTemperatureUnit}
              className="hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all bg-transparent h-8 w-8 p-0 rounded-xl text-xs font-semibold"
              title="Toggle temperature unit"
            >
              {getTemperatureSymbol()}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all h-8 w-8 p-0 rounded-xl"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            {onSettingsClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={onSettingsClick}
                className="hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all bg-transparent h-8 w-8 p-0 rounded-xl"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            )}
            {refetch && (
              <Button
                size="sm"
                variant="outline"
                onClick={refetch}
                disabled={loading}
                className="hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all bg-transparent h-8 w-8 p-0 rounded-xl"
                title="Refresh data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="animate-slide-up animate-delay-100">
          <WeatherAlerts weather={weather.current} hourly={weather.hourly} />
        </div>

        {/* Current Weather Hero Card */}
        <div className="animate-slide-up animate-delay-200">
          <CurrentWeatherCard weather={weather.current} location={weather.location} />
        </div>

        {/* Details + Sunrise + Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up animate-delay-300">
          <div className="lg:col-span-2">
            <WeatherDetailsGrid weather={weather.current} airQuality={weather.air_quality} />
          </div>
          <div className="space-y-6">
            {weather.daily && weather.daily.length > 0 && (
              <SunriseSunset
                sunrise={weather.daily[0].sunrise}
                sunset={weather.daily[0].sunset}
              />
            )}
            <WeatherMap lat={location.lat} lon={location.lon} />
          </div>
        </div>

        {/* Forecast Section */}
        <Card className="shadow-xl border-0 glass-card rounded-xl sm:rounded-2xl animate-slide-up animate-delay-400 overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-bold gradient-text">Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <Tabs defaultValue="hourly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-9 sm:h-10">
                <TabsTrigger
                  value="hourly"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all text-xs sm:text-sm"
                >
                  Hourly
                </TabsTrigger>
                <TabsTrigger
                  value="daily"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all text-sm"
                >
                  7-Day
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all text-sm"
                >
                  Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hourly" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <HourlyForecast hourly={weather.hourly} />
              </TabsContent>

              <TabsContent value="daily" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <DailyForecast daily={weather.daily} />
              </TabsContent>

              <TabsContent value="chart" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <ForecastChart hourly={weather.hourly} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Card className="glass-card border-0 rounded-xl hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <TrendingUp className="h-4 w-4 text-accent" />
                        </div>
                        <h4 className="font-semibold text-sm">Today's Range</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl sm:text-2xl font-bold">
                          {convertTemperature(weather.daily[0]?.temp_max)}° /{" "}
                          {convertTemperature(weather.daily[0]?.temp_min)}°
                        </p>
                        <p className="text-xs text-muted-foreground">High / Low</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-0 rounded-xl hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          <Droplets className="h-4 w-4 text-blue-500" />
                        </div>
                        <h4 className="font-semibold text-sm">Rain Chance</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">
                          {Math.max(...weather.hourly.slice(0, 8).map((h) => h.precipitation_probability))}%
                        </p>
                        <p className="text-xs text-muted-foreground">Next 24 hours</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-0 rounded-xl hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                          <Sun className="h-4 w-4 text-orange-500" />
                        </div>
                        <h4 className="font-semibold text-sm">UV Index</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{weather.current.uv_index || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">
                          {(weather.current.uv_index || 0) < 3
                            ? "Low"
                            : (weather.current.uv_index || 0) < 6
                              ? "Moderate"
                              : (weather.current.uv_index || 0) < 8
                                ? "High"
                                : "Very High"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted-foreground/50 animate-fade-in animate-delay-500">
          <p>SimplyWeather • Made By Aditya Singh With ❤️ and ☕</p>
        </footer>
      </div>
    </div>
  )
}

function WeatherDashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <div>
            <Skeleton className="h-7 w-48 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>

      {/* Main card skeleton */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-40 mb-2 rounded-lg" />
            <Skeleton className="h-20 w-32 mb-3 rounded-lg" />
            <Skeleton className="h-6 w-36 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="mt-8 pt-6 border-t border-border/30 grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-5 w-5 mx-auto mb-2 rounded-full" />
              <Skeleton className="h-8 w-16 mx-auto mb-1 rounded-lg" />
              <Skeleton className="h-3 w-20 mx-auto rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Details grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <Skeleton className="h-4 w-16 mb-3 rounded-lg" />
            <Skeleton className="h-7 w-24 mb-1 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
