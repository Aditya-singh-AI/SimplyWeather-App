"use client"

import { useState } from "react"
import { MapPin, Navigation, AlertCircle, CloudSun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LocationPermissionProps {
  onLocationGranted: (lat: number, lon: number) => void
  onSkip: () => void
}

export function LocationPermission({ onLocationGranted, onSkip }: LocationPermissionProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
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
        let errorMessage = "Failed to get location"
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location access was denied. You can search for your city manually."
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case err.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="hero-gradient-bg" />
      <div className="hero-mesh-overlay" />

      <Card className="relative z-10 w-full max-w-md bg-white/[0.07] backdrop-blur-xl border-white/[0.1] rounded-3xl shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl -z-10" />

        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/20 animate-float">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mx-auto mb-3">
            <CloudSun className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-white/70">SimplyWeather</span>
            <Sparkles className="h-3 w-3 text-purple-400" />
          </div>
          <CardTitle className="text-xl text-white">Enable Location Access</CardTitle>
          <CardDescription className="text-white/50">
            Get accurate weather information for your current location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={requestLocation}
              disabled={loading}
              className="w-full h-12 text-sm font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl border-0"
              size="lg"
            >
              <Navigation className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>

            <Button
              onClick={onSkip}
              variant="outline"
              className="w-full h-11 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white border-white/[0.1] transition-all"
              size="lg"
            >
              Search Manually
            </Button>
          </div>

          <div className="text-center text-xs text-white/30 pt-2">
            <p>Your location data is not stored or shared.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
