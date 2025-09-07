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
      <Alert className="max-w-md mx-auto">
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {refetch && (
            <Button size="sm" variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </AlertDescription>
      </Alert>
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
      <div className={`fixed inset-0 ${weatherBg} opacity-10 -z-10`} />

      <div className="space-y-8 p-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-card shadow-lg animate-float">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">
                {location.name || `${weather.location.name}, ${weather.location.country}`}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {location.isCurrentLocation && (
                  <Badge variant="secondary" className="animate-pulse-glow">
                    <Star className="h-3 w-3 mr-1" />
                    Current Location
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTemperatureUnit}
              className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
            >
              {getTemperatureSymbol()}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {onSettingsClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={onSettingsClick}
                className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            {refetch && (
              <Button
                size="sm"
                variant="outline"
                onClick={refetch}
                disabled={loading}
                className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        <CurrentWeatherCard weather={weather.current} location={weather.location} />

        <WeatherDetailsGrid weather={weather.current} airQuality={weather.air_quality} />

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-balance">Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hourly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger
                  value="hourly"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all"
                >
                  Hourly
                </TabsTrigger>
                <TabsTrigger
                  value="daily"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all"
                >
                  7-Day
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all"
                >
                  Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hourly" className="space-y-6 mt-6">
                <HourlyForecast hourly={weather.hourly} />
              </TabsContent>

              <TabsContent value="daily" className="space-y-6 mt-6">
                <DailyForecast daily={weather.daily} />
              </TabsContent>

              <TabsContent value="chart" className="space-y-6 mt-6">
                <ForecastChart hourly={weather.hourly} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Today's Range</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">
                          {convertTemperature(weather.daily[0]?.temp_max)}° /{" "}
                          {convertTemperature(weather.daily[0]?.temp_min)}°
                        </p>
                        <p className="text-sm text-muted-foreground">High / Low</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold">Rain Chance</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">
                          {Math.max(...weather.hourly.slice(0, 8).map((h) => h.precipitation_probability))}%
                        </p>
                        <p className="text-sm text-muted-foreground">Next 24 hours</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Sun className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold">UV Index</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{weather.current.uv_index || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
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
      </div>
    </div>
  )
}

function WeatherDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-16 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
