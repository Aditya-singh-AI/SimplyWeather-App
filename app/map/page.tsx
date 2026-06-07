"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Map, Cloud, Thermometer, Droplets, Wind, Layers, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WeatherBackground } from "@/components/weather-background"
import { useWeather } from "@/hooks/use-weather"
import type { UserLocation } from "@/hooks/use-location"

type MapLayer = "clouds" | "precipitation" | "temp" | "wind"

function lonLatToTile(lon: number, lat: number, zoom: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  )
  return { x, y }
}

export default function MapPage() {
  const router = useRouter()
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeLayer, setActiveLayer] = useState<MapLayer>("clouds")
  const [zoom, setZoom] = useState(7)

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

  return <MapContent location={location} mounted={mounted} activeLayer={activeLayer} setActiveLayer={setActiveLayer} zoom={zoom} setZoom={setZoom} />
}

function MapContent({
  location,
  mounted,
  activeLayer,
  setActiveLayer,
  zoom,
  setZoom,
}: {
  location: UserLocation
  mounted: boolean
  activeLayer: MapLayer
  setActiveLayer: (l: MapLayer) => void
  zoom: number
  setZoom: (z: number) => void
}) {
  const { weather } = useWeather(location.lat, location.lon)
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20
  const tile = lonLatToTile(location.lon, location.lat, zoom)

  const layerConfig: Record<MapLayer, { label: string; icon: React.ReactNode; desc: string; color: string }> = {
    clouds: { label: "Clouds", icon: <Cloud className="h-4 w-4" />, desc: "Cloud coverage overlay", color: "text-slate-400" },
    precipitation: { label: "Rain", icon: <Droplets className="h-4 w-4" />, desc: "Precipitation intensity", color: "text-blue-400" },
    temp: { label: "Temperature", icon: <Thermometer className="h-4 w-4" />, desc: "Surface temperature", color: "text-orange-400" },
    wind: { label: "Wind", icon: <Wind className="h-4 w-4" />, desc: "Wind speed & direction", color: "text-cyan-400" },
  }

  return (
    <div className="min-h-screen relative">
      <WeatherBackground weatherCode={weather?.current.weather_code} isDay={isDay} />

      <div className="relative z-10 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
          {/* Header */}
          <header
            className={`mb-6 sm:mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Map className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text">Weather Map</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {location.name || "Current location"} • {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-5 page-enter">
            {/* Layer Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {(Object.entries(layerConfig) as [MapLayer, typeof layerConfig[MapLayer]][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveLayer(key)}
                  className={`glass-card rounded-2xl p-4 text-left transition-all duration-300 border-0 cursor-pointer ${
                    activeLayer === key
                      ? "ring-2 ring-accent/40 shadow-lg shadow-accent/10"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className={`mb-2 ${config.color}`}>{config.icon}</div>
                  <p className={`text-sm font-semibold ${activeLayer === key ? "text-accent" : ""}`}>{config.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{config.desc}</p>
                </button>
              ))}
            </div>

            {/* Map Display */}
            <Card className="glass-card border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-muted/20 overflow-hidden">
                  {/* Base map tiles - 3x3 grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[-1, 0, 1].map((dy) =>
                      [-1, 0, 1].map((dx) => (
                        <img
                          key={`${dx}-${dy}`}
                          src={`https://tile.openstreetmap.org/${zoom}/${tile.x + dx}/${tile.y + dy}.png`}
                          alt=""
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          loading="lazy"
                        />
                      ))
                    )}
                  </div>

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-background/20 dark:bg-background/45 mix-blend-multiply" />

                  {/* Center marker */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      <div className="w-5 h-5 bg-accent rounded-full shadow-lg shadow-accent/50" />
                      <div className="absolute inset-0 w-5 h-5 bg-accent/30 rounded-full animate-ping" />
                      <div className="absolute -inset-3 w-11 h-11 bg-accent/10 rounded-full animate-breathe" />
                    </div>
                  </div>

                  {/* Layer info */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge className="bg-background/70 backdrop-blur-sm text-xs text-muted-foreground border-0 gap-1">
                      <Layers className="h-3 w-3" />
                      {layerConfig[activeLayer].label}
                    </Badge>
                  </div>

                  {/* Coordinates */}
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-background/70 backdrop-blur-sm text-xs text-muted-foreground border-0 font-mono">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                    </Badge>
                  </div>

                  {/* Zoom controls */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-lg bg-background/70 backdrop-blur-sm"
                      onClick={() => setZoom(Math.min(zoom + 1, 12))}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-lg bg-background/70 backdrop-blur-sm"
                      onClick={() => setZoom(Math.max(zoom - 1, 3))}
                    >
                      −
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Legend */}
            {weather && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Temperature", value: `${weather.current.temp}°C`, icon: <Thermometer className="h-3.5 w-3.5 text-orange-400" /> },
                  { label: "Wind", value: `${Math.round(weather.current.wind_speed)} km/h`, icon: <Wind className="h-3.5 w-3.5 text-cyan-400" /> },
                  { label: "Humidity", value: `${weather.current.humidity}%`, icon: <Droplets className="h-3.5 w-3.5 text-blue-400" /> },
                  { label: "Visibility", value: `${weather.current.visibility} km`, icon: <Cloud className="h-3.5 w-3.5 text-slate-400" /> },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-3 border-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {stat.icon}
                      <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="text-center py-8 text-xs text-muted-foreground/40 animate-fade-in animate-delay-500">
            <p>SimplyWeather • Made By Aditya Singh With ❤️ and ☕</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
