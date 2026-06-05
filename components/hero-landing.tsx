"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Navigation, CloudSun, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeatherParticles } from "@/components/weather-particles"
import type { UserLocation } from "@/hooks/use-location"

interface HeroLandingProps {
  onLocationGranted: (lat: number, lon: number) => void
  onSkip: () => void
}

export function HeroLanding({ onLocationGranted, onSkip }: HeroLandingProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationGranted(position.coords.latitude, position.coords.longitude)
        setLoading(false)
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location access denied"
            : "Could not get location"
        )
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return "Good Night"
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    if (hour < 21) return "Good Evening"
    return "Good Night"
  }

  const getTimeEmoji = () => {
    const hour = new Date().getHours()
    if (hour < 6) return "🌙"
    if (hour < 12) return "🌅"
    if (hour < 17) return "☀️"
    if (hour < 21) return "🌇"
    return "🌙"
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="hero-gradient-bg" />

      {/* Mesh gradient overlay */}
      <div className="hero-mesh-overlay" />

      {/* Particle system */}
      <WeatherParticles variant="hero" count={50} />

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo / Brand */}
        <div
          className={`mb-8 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <CloudSun className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium text-white/90 tracking-wide">SimplyWeather</span>
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            {getTimeGreeting()} {getTimeEmoji()}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/60 font-light max-w-lg mx-auto leading-relaxed">
            Beautiful, real-time weather forecasts at your fingertips.
            <br />
            <span className="text-white/40">Powered by intelligence.</span>
          </p>
        </div>

        {/* Main CTA Area */}
        <div
          className={`space-y-4 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Glass search/CTA card */}
          <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] shadow-2xl">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-amber-500/20 blur-xl -z-10" />

            <div className="space-y-5">
              {/* Primary action: Use Location */}
              <Button
                onClick={requestLocation}
                disabled={loading}
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] border-0"
                size="lg"
              >
                <Navigation className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Detecting Location..." : "Use My Current Location"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Secondary action: Search */}
              <Button
                onClick={onSkip}
                variant="outline"
                className="w-full h-12 text-sm font-medium rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white border-white/[0.1] transition-all duration-300"
                size="lg"
              >
                <Search className="mr-2 h-4 w-4" />
                Search for a City
              </Button>

              {error && (
                <p className="text-sm text-red-400/80 text-center animate-in fade-in slide-in-from-top-2">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Trust indicators */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-white/25 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Privacy-first
            </span>
            <span>•</span>
            <span>Real-time data</span>
            <span>•</span>
            <span>7-day forecast</span>
          </div>
        </div>

        {/* Animated weather icons floating */}
        <div className="absolute -top-20 -left-20 text-6xl opacity-20 animate-float select-none pointer-events-none">
          ☁️
        </div>
        <div
          className="absolute -bottom-10 -right-16 text-5xl opacity-15 select-none pointer-events-none"
          style={{ animation: "float 4s ease-in-out infinite 1s" }}
        >
          🌤️
        </div>
        <div
          className="absolute top-1/4 -right-24 text-4xl opacity-10 select-none pointer-events-none"
          style={{ animation: "float 5s ease-in-out infinite 0.5s" }}
        >
          ⛅
        </div>
      </div>
    </div>
  )
}
