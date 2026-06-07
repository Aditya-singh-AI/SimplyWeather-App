"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin, RefreshCw, Star, Sun, Moon, CloudSun, Sparkles,
  Wind, Eye, Gauge, Droplets, Thermometer, Sunrise, Sunset,
  Activity, Clock, Navigation
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LocationSearch } from "@/components/location-search"
import { WeatherBackground } from "@/components/weather-background"
import { WeatherParticles } from "@/components/weather-particles"
import { WeatherAlerts } from "@/components/weather-alerts"
import { HourlyForecast } from "@/components/hourly-forecast"
import { SunriseSunset } from "@/components/sunrise-sunset"
import { useWeather } from "@/hooks/use-weather"
import { useSettings } from "@/hooks/use-settings"
import { useLocation, type UserLocation } from "@/hooks/use-location"
import { useTheme } from "next-themes"
import { getWeatherIcon } from "@/lib/weather-api"
import type { WeatherData } from "@/lib/weather-api"

export default function WeatherPage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null)
  const { currentLocation } = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("weather-current-location")
    if (saved) { try { setSelectedLocation(JSON.parse(saved)) } catch {} }
  }, [])

  useEffect(() => {
    if (currentLocation && !selectedLocation) setSelectedLocation(currentLocation)
  }, [currentLocation, selectedLocation])

  const handleLocationSelect = (loc: UserLocation) => {
    setSelectedLocation(loc)
    localStorage.setItem("weather-current-location", JSON.stringify(loc))
  }

  if (!selectedLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <WeatherBackground />
        <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in relative z-10">
          <div className="text-6xl mb-6 animate-float">🌍</div>
          <h2 className="text-2xl font-bold mb-3 gradient-text">Select a Location</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">Search for a city to see weather</p>
          <LocationSearch onLocationSelect={handleLocationSelect} currentLocation={currentLocation || undefined} />
        </div>
      </div>
    )
  }

  return <Dashboard location={selectedLocation} onLocationSelect={handleLocationSelect} currentLocation={currentLocation} mounted={mounted} />
}

/* ========== BENTO GRID DASHBOARD ========== */
function Dashboard({ location, onLocationSelect, currentLocation, mounted }: {
  location: UserLocation
  onLocationSelect: (l: UserLocation) => void
  currentLocation: UserLocation | null
  mounted: boolean
}) {
  const { weather, loading, error, refetch } = useWeather(location.lat, location.lon)
  const { convertTemperature, getTemperatureSymbol, toggleTemperatureUnit } = useSettings()
  const { theme, setTheme } = useTheme()
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20

  if (loading) return <DashboardSkeleton />
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WeatherBackground />
      <div className="glass-card rounded-3xl p-8 max-w-md text-center animate-scale-in relative z-10">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-foreground font-medium mb-4">{error}</p>
        {refetch && <Button size="sm" variant="outline" onClick={refetch} className="gap-2"><RefreshCw className="h-4 w-4" />Retry</Button>}
      </div>
    </div>
  )
  if (!weather) return null

  const w = weather.current
  const icon = getWeatherIcon(w.weather_code, isDay)
  const temp = convertTemperature(w.temp)
  const feelsLike = convertTemperature(w.feels_like)
  const sym = getTemperatureSymbol()
  const lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const getParticleVariant = () => {
    const c = w.weather_code
    if (c >= 200 && c < 600) return "rain" as const
    if (c >= 600 && c < 700) return "snow" as const
    if (c === 800) return isDay ? "clouds" as const : "stars" as const
    return "clouds" as const
  }

  const getTempColor = () => {
    if (w.temp >= 35) return "text-red-500"
    if (w.temp >= 25) return "text-amber-500"
    if (w.temp >= 15) return "text-emerald-500"
    if (w.temp >= 5) return "text-blue-400"
    return "text-indigo-400"
  }

  const windDir = (d: number) => {
    const dirs = ["N","NE","E","SE","S","SW","W","NW"]
    return dirs[Math.round(d / 45) % 8]
  }

  const aqiLabel = (aqi: number) => {
    if (aqi <= 1) return { t: "Good", c: "text-emerald-400" }
    if (aqi <= 2) return { t: "Fair", c: "text-yellow-400" }
    if (aqi <= 3) return { t: "Moderate", c: "text-orange-400" }
    return { t: "Poor", c: "text-red-400" }
  }

  return (
    <div className="min-h-screen relative">
      <WeatherBackground weatherCode={w.weather_code} isDay={isDay} />
      <WeatherParticles variant={getParticleVariant()} count={35} />

      <div className="relative z-10 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-6 max-w-7xl">

          {/* ── HEADER ── */}
          <header className={`mb-5 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:hidden">
                <CloudSun className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-accent">SimplyWeather</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LocationSearch onLocationSelect={onLocationSelect} currentLocation={currentLocation || undefined} />
                <Button size="sm" variant="outline" onClick={toggleTemperatureUnit} className="h-8 w-8 p-0 rounded-xl bg-transparent text-xs font-bold hover:bg-accent/10 hover:text-accent">{sym}</Button>
                <Button size="sm" variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-8 w-8 p-0 rounded-xl hover:bg-accent/10 hover:text-accent">
                  {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </Button>
                {refetch && <Button size="sm" variant="outline" onClick={refetch} className="h-8 w-8 p-0 rounded-xl hover:bg-accent/10 hover:text-accent"><RefreshCw className="h-3.5 w-3.5" /></Button>}
              </div>
            </div>
          </header>

          {/* ── ALERTS ── */}
          <WeatherAlerts weather={w} hourly={weather.hourly} />

          {/* ══════════════ BENTO GRID ══════════════ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 page-enter">

            {/* ── HERO TILE (spans 2 cols, 2 rows) ── */}
            <div className="col-span-2 row-span-2 glass-card glass-card-glow rounded-3xl p-5 sm:p-8 flex flex-col justify-between min-h-[320px] sm:min-h-[380px] relative overflow-hidden border-0">
              <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-500/60 via-purple-400/40 to-blue-500/60 rounded-t-3xl" />
              {/* Top: location + date */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <span className="text-sm font-semibold truncate">{location.name || `${weather.location.name}, ${weather.location.country}`}</span>
                  {location.isCurrentLocation && <Navigation className="h-3 w-3 text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground">{dayName}, {dateStr} · {lastUpdated}</p>
              </div>
              {/* Center: temp + icon */}
              <div className="flex items-center justify-between my-4">
                <div>
                  <div className="flex items-start">
                    <span className={`text-8xl sm:text-9xl md:text-[140px] font-extralight leading-none tracking-tighter ${getTempColor()}`}>{temp}</span>
                    <span className="text-2xl sm:text-3xl text-muted-foreground font-extralight mt-2">{sym}</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold capitalize mt-2">{w.weather_description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Feels like {feelsLike}{sym} · Humidity {w.humidity}%</p>
                </div>
                <div className="weather-icon-container shrink-0">
                  <span className="text-7xl sm:text-8xl md:text-9xl animate-float drop-shadow-2xl select-none block">{icon}</span>
                </div>
              </div>
              {/* Bottom: quick stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/15">
                {[
                  { i: <Wind className="h-3.5 w-3.5" />, v: `${Math.round(w.wind_speed)}`, u: "km/h", l: "Wind" },
                  { i: <Eye className="h-3.5 w-3.5" />, v: `${w.visibility}`, u: "km", l: "Visibility" },
                  { i: <Gauge className="h-3.5 w-3.5" />, v: `${w.pressure}`, u: "hPa", l: "Pressure" },
                ].map(s => (
                  <div key={s.l} className="text-center p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                    <div className="text-accent/50 flex justify-center mb-1">{s.i}</div>
                    <p className="text-lg font-semibold">{s.v}<span className="text-[10px] text-muted-foreground ml-0.5">{s.u}</span></p>
                    <p className="text-[10px] text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WIND TILE ── */}
            <BentoTile icon={<Wind className="h-4 w-4 text-sky-400" />} label="Wind" bgClass="bg-sky-500/10">
              <p className="text-3xl font-extralight mt-2">{Math.round(w.wind_speed)} <span className="text-sm text-muted-foreground">km/h</span></p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full border border-sky-400/30 flex items-center justify-center">
                  <div className="w-0.5 h-3 bg-sky-400 rounded-full origin-bottom" style={{ transform: `rotate(${w.wind_direction}deg)` }} />
                </div>
                <span className="text-xs text-muted-foreground">{windDir(w.wind_direction)} ({w.wind_direction}°)</span>
              </div>
            </BentoTile>

            {/* ── HUMIDITY TILE ── */}
            <BentoTile icon={<Droplets className="h-4 w-4 text-blue-400" />} label="Humidity" bgClass="bg-blue-500/10">
              <p className="text-3xl font-extralight mt-2">{w.humidity}<span className="text-sm text-muted-foreground">%</span></p>
              <div className="w-full h-1.5 rounded-full bg-muted/30 mt-3 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000" style={{ width: `${w.humidity}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{w.humidity < 30 ? "Low" : w.humidity < 60 ? "Comfortable" : w.humidity < 80 ? "High" : "Very High"}</p>
            </BentoTile>

            {/* ── FEELS LIKE TILE ── */}
            <BentoTile icon={<Thermometer className="h-4 w-4 text-rose-400" />} label="Feels Like" bgClass="bg-rose-500/10">
              <p className="text-3xl font-extralight mt-2">{feelsLike}<span className="text-sm text-muted-foreground">{sym}</span></p>
              <p className="text-[10px] text-muted-foreground mt-2">
                {Math.abs(w.feels_like - w.temp) <= 2 ? "Similar to actual temp" : w.feels_like > w.temp ? "Feels warmer" : "Feels cooler"}
              </p>
            </BentoTile>

            {/* ── UV INDEX TILE ── */}
            <BentoTile icon={<Sun className="h-4 w-4 text-amber-400" />} label="UV Index" bgClass="bg-amber-500/10">
              <p className="text-3xl font-extralight mt-2">{w.uv_index || 0}</p>
              <div className="w-full h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: "linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #a855f7)" }}>
                <div className="h-full w-1.5 rounded-full bg-white shadow-md transition-all duration-700" style={{ marginLeft: `${Math.min(((w.uv_index || 0) / 11) * 100, 97)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {(w.uv_index || 0) < 3 ? "Low" : (w.uv_index || 0) < 6 ? "Moderate" : (w.uv_index || 0) < 8 ? "High" : "Very High"}
              </p>
            </BentoTile>

            {/* ── HOURLY (spans 2 cols) ── */}
            <div className="col-span-2 lg:col-span-4">
              <HourlyForecast hourly={weather.hourly} />
            </div>

            {/* ── SUNRISE/SUNSET TILE ── */}
            <div className="col-span-2">
              {weather.daily?.[0] && <SunriseSunset sunrise={weather.daily[0].sunrise} sunset={weather.daily[0].sunset} />}
            </div>

            {/* ── AIR QUALITY TILE ── */}
            {weather.air_quality && (
              <BentoTile icon={<Activity className="h-4 w-4 text-emerald-400" />} label="Air Quality" bgClass="bg-emerald-500/10">
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-extralight">{weather.air_quality.aqi}</p>
                  <span className={`text-xs font-semibold ${aqiLabel(weather.air_quality.aqi).c}`}>{aqiLabel(weather.air_quality.aqi).t}</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-3">
                  <span>PM2.5: {weather.air_quality.pm2_5.toFixed(1)}</span>
                  <span>PM10: {weather.air_quality.pm10.toFixed(1)}</span>
                </div>
              </BentoTile>
            )}

            {/* ── PRESSURE TILE ── */}
            <BentoTile icon={<Gauge className="h-4 w-4 text-violet-400" />} label="Pressure" bgClass="bg-violet-500/10">
              <p className="text-3xl font-extralight mt-2">{w.pressure}<span className="text-xs text-muted-foreground ml-1">hPa</span></p>
              <p className="text-[10px] text-muted-foreground mt-2">{w.pressure < 1000 ? "Low — Stormy" : w.pressure < 1020 ? "Normal" : "High — Stable"}</p>
            </BentoTile>

          </div>

          <footer className="text-center py-8 text-xs text-muted-foreground/30">SimplyWeather • Made By Aditya Singh With ❤️ and ☕</footer>
        </div>
      </div>
    </div>
  )
}

/* ========== BENTO TILE WRAPPER ========== */
function BentoTile({ icon, label, bgClass, children }: { icon: React.ReactNode; label: string; bgClass: string; children: React.ReactNode }) {
  return (
    <div className="glass-card border-0 rounded-2xl p-4 sm:p-5 group hover:shadow-xl transition-all duration-300 cursor-default">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded-xl ${bgClass} group-hover:scale-110 transition-transform`}>{icon}</div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  )
}

/* ========== SKELETON ========== */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen relative">
      <WeatherBackground />
      <div className="relative z-10 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="col-span-2 row-span-2 glass-card rounded-3xl p-8 min-h-[380px]">
              <Skeleton className="h-5 w-40 mb-6 rounded-lg" />
              <Skeleton className="h-28 w-48 mb-4 rounded-lg" />
              <Skeleton className="h-6 w-36 rounded-lg" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <Skeleton className="h-4 w-16 mb-3 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
