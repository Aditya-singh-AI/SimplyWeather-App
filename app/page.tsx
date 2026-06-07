"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation, ArrowRight, CloudSun, Sparkles, Search, MapPin, Zap, Shield, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeatherParticles } from "@/components/weather-particles"
import type { UserLocation } from "@/hooks/use-location"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user already has a saved location
    const savedLocation = localStorage.getItem("weather-current-location")
    if (savedLocation) {
      try {
        JSON.parse(savedLocation)
        router.push("/weather")
      } catch {}
    }
  }, [router])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "Current Location",
          isCurrentLocation: true,
        }
        localStorage.setItem("weather-current-location", JSON.stringify(location))
        setLoading(false)
        router.push("/weather")
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
      <div className="hero-mesh-overlay" />

      {/* Particle system */}
      <WeatherParticles variant="hero" count={60} />

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Brand badge */}
        <div
          className={`mb-10 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] mb-8">
            <CloudSun className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wide">SimplyWeather</span>
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight text-white mb-4 tracking-tight leading-none">
            {getTimeGreeting()}
          </h1>
          <div className="text-5xl sm:text-6xl mb-6 animate-float">{getTimeEmoji()}</div>
          <p className="text-base sm:text-lg md:text-xl text-white/50 font-light max-w-xl mx-auto leading-relaxed">
            Beautiful, real-time weather forecasts
            <br />
            <span className="text-white/30">crafted with precision and elegance.</span>
          </p>
        </div>

        {/* CTA Card */}
        <div
          className={`space-y-5 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative p-6 sm:p-10 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl -z-10" />

            <div className="space-y-5">
              <Button
                onClick={requestLocation}
                disabled={loading}
                className="w-full h-14 sm:h-16 text-sm sm:text-base font-semibold rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] border-0"
                size="lg"
                id="cta-use-location"
              >
                <Navigation className={`mr-2.5 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Detecting Location..." : "Use My Current Location"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-white/25 uppercase tracking-widest font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              <Button
                onClick={() => router.push("/weather")}
                variant="outline"
                className="w-full h-13 text-sm font-medium rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border-white/[0.08] transition-all duration-300"
                size="lg"
                id="cta-search-city"
              >
                <Search className="mr-2 h-4 w-4" />
                Search for a City
              </Button>

              {error && (
                <p className="text-sm text-red-400/80 text-center animate-counter-up">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Features row */}
          <div
            className={`grid grid-cols-3 gap-3 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {[
              { icon: Zap, label: "Real-time Data", desc: "Updated every 15min" },
              { icon: Shield, label: "Privacy-first", desc: "No tracking" },
              { icon: BarChart3, label: "7-Day Forecast", desc: "Hourly details" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
              >
                <feature.icon className="h-4 w-4 text-purple-400/70" />
                <span className="text-xs text-white/40 font-medium">{feature.label}</span>
                <span className="text-[10px] text-white/20">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating weather emojis */}
        <div className="absolute -top-20 -left-20 text-7xl opacity-[0.08] animate-float select-none pointer-events-none">☁️</div>
        <div className="absolute -bottom-10 -right-16 text-6xl opacity-[0.06] select-none pointer-events-none" style={{ animation: "float 4s ease-in-out infinite 1s" }}>🌤️</div>
        <div className="absolute top-1/4 -right-24 text-5xl opacity-[0.04] select-none pointer-events-none" style={{ animation: "float 5s ease-in-out infinite 0.5s" }}>⛅</div>
      </div>
    </div>
  )
}
