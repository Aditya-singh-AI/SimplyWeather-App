"use client"

import { useState } from "react"
import { Map, Layers, Cloud, Thermometer, Droplets, Wind } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WeatherMapProps {
  lat: number
  lon: number
  className?: string
}

type MapLayer = "clouds" | "precipitation" | "temp" | "wind"

export function WeatherMap({ lat, lon, className }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("clouds")
  const zoom = 7

  // OpenStreetMap tile URL
  const osmTileUrl = `https://tile.openstreetmap.org/${zoom}/${lonLatToTile(lon, lat, zoom).x}/${lonLatToTile(lon, lat, zoom).y}.png`

  // OpenWeatherMap tile layers (free tier)
  const layerConfig: Record<MapLayer, { label: string; icon: React.ReactNode; param: string }> = {
    clouds: { label: "Clouds", icon: <Cloud className="h-3 w-3" />, param: "clouds_new" },
    precipitation: { label: "Rain", icon: <Droplets className="h-3 w-3" />, param: "precipitation_new" },
    temp: { label: "Temp", icon: <Thermometer className="h-3 w-3" />, param: "temp_new" },
    wind: { label: "Wind", icon: <Wind className="h-3 w-3" />, param: "wind_new" },
  }

  const tile = lonLatToTile(lon, lat, zoom)

  return (
    <Card className={`overflow-hidden border-0 bg-card/60 backdrop-blur-md shadow-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Map className="h-4 w-4 text-accent" />
          Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Layer toggle buttons */}
        <div className="flex gap-1 px-4 pb-3">
          {(Object.entries(layerConfig) as [MapLayer, typeof layerConfig[MapLayer]][]).map(
            ([key, config]) => (
              <Button
                key={key}
                variant={activeLayer === key ? "default" : "outline"}
                size="sm"
                className={`text-xs h-7 px-2 gap-1 ${
                  activeLayer === key
                    ? "bg-accent text-accent-foreground"
                    : "bg-transparent hover:bg-muted/50"
                }`}
                onClick={() => setActiveLayer(key)}
              >
                {config.icon}
                {config.label}
              </Button>
            )
          )}
        </div>

        {/* Map display */}
        <div className="relative w-full aspect-[16/9] bg-muted/30 overflow-hidden">
          {/* Base map tiles - 3x3 grid for context */}
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
                  style={{ imageRendering: "auto" }}
                />
              ))
            )}
          </div>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-background/30 dark:bg-background/50 mix-blend-multiply" />

          {/* Center marker */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50 animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-accent/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* Layer info badge */}
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/70 backdrop-blur-sm text-xs text-muted-foreground flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {layerConfig[activeLayer].label} Layer
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-background/70 backdrop-blur-sm text-xs text-muted-foreground font-mono">
            {lat.toFixed(2)}°, {lon.toFixed(2)}°
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Convert lon/lat to tile coordinates for OpenStreetMap
function lonLatToTile(lon: number, lat: number, zoom: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  )
  return { x, y }
}
