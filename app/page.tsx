"use client"

import { useState, useEffect } from "react"
import { LocationPermission } from "@/components/location-permission"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { LocationSearch } from "@/components/location-search"
import { SettingsDialog } from "@/components/settings-dialog"
import { useLocation, type UserLocation } from "@/hooks/use-location"

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null)
  const [showLocationPermission, setShowLocationPermission] = useState(true)
  const { currentLocation } = useLocation()

  // Check if user has a saved location preference
  useEffect(() => {
    const savedLocation = localStorage.getItem("weather-current-location")
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setSelectedLocation(location)
        setShowLocationPermission(false)
      } catch (err) {
        console.error("Failed to parse saved location:", err)
      }
    }
  }, [])

  // Auto-select current location when available
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation)
      setShowLocationPermission(false)
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
    setShowLocationPermission(false)
    localStorage.setItem("weather-current-location", JSON.stringify(location))
  }

  const handleLocationSelect = (location: UserLocation) => {
    setSelectedLocation(location)
    localStorage.setItem("weather-current-location", JSON.stringify(location))
  }

  const handleSkipLocation = () => {
    setShowLocationPermission(false)
  }

  if (showLocationPermission && !selectedLocation) {
    return <LocationPermission onLocationGranted={handleLocationGranted} onSkip={handleSkipLocation} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
              <p className="text-muted-foreground">Stay updated with current conditions and forecasts</p>
            </div>
            <div className="flex items-center gap-2">
              <LocationSearch onLocationSelect={handleLocationSelect} currentLocation={currentLocation} />
              <SettingsDialog />
            </div>
          </div>
        </header>

        {selectedLocation ? (
          <WeatherDashboard location={selectedLocation} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a Location</h2>
              <p className="text-muted-foreground">Search for a city to view weather information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
