"use client"

import { useState } from "react"
import { MapPin, Navigation, AlertCircle } from "lucide-react"
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Enable Location Access</CardTitle>
          <CardDescription>Get accurate weather information for your current location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button onClick={requestLocation} disabled={loading} className="w-full" size="lg">
              <Navigation className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>

            <Button onClick={onSkip} variant="outline" className="w-full bg-transparent" size="lg">
              Search Manually
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>We use your location to provide accurate weather forecasts.</p>
            <p className="mt-1">Your location data is not stored or shared.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
