"use client"

import { useState, useEffect } from "react"
import { HeroLanding } from "@/components/hero-landing"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { LocationSearch } from "@/components/location-search"
import { SettingsDialog } from "@/components/settings-dialog"
import { useLocation, type UserLocation } from "@/hooks/use-location"
import { CloudSun, Sparkles } from "lucide-react"

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null)
  const [showHero, setShowHero] = useState(true)
  const { currentLocation } = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user has a saved location preference
  useEffect(() => {
    const savedLocation = localStorage.getItem("weather-current-location")
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setSelectedLocation(location)
        setShowHero(false)
      } catch (err) {
        console.error("Failed to parse saved location:", err)
      }
    }
  }, [])

  // Auto-select current location when available
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation)
      setShowHero(false)
    }
  }, [currentLocation, selectedLocation])

  const handleLocationGranted = (lat: number, lon: number) => {
    const location: UserLocation = {
      lat,
      lon,
      name: "Current Location",
      isCurrentLocation: true,
    }
    setSelectedLocation(location)
    setShowHero(false)
    localStorage.setItem("weather-current-location", JSON.stringify(location))
  }

  const handleLocationSelect = (location: UserLocation) => {
    setSelectedLocation(location)
    localStorage.setItem("weather-current-location", JSON.stringify(location))
  }

  const handleSkipLocation = () => {
    setShowHero(false)
  }

  // Show hero landing page
  if (showHero && !selectedLocation) {
    return (
      <HeroLanding
        onLocationGranted={handleLocationGranted}
        onSkip={handleSkipLocation}
      />
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Ambient background */}
      <div className="dashboard-ambient" />

      <div className="relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
          {/* Header */}
          <header
            className={`relative z-50 mb-4 sm:mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                  <CloudSun className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent tracking-wide">SimplyWeather</span>
                  <Sparkles className="h-3 w-3 text-accent/60" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  currentLocation={currentLocation}
                />
                <SettingsDialog />
              </div>
            </div>
          </header>

          {/* Dashboard or Empty State */}
          {selectedLocation ? (
            <div
              className={`transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <WeatherDashboard location={selectedLocation} />
            </div>
          ) : (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center glass-card rounded-3xl p-12 max-w-md mx-auto animate-scale-in">
                <div className="text-6xl mb-6 animate-float">🌍</div>
                <h2 className="text-2xl font-bold mb-3 gradient-text">Select a Location</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Search for a city above to view beautiful, real-time weather information
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
