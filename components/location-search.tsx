"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Trash2, Navigation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLocation, type UserLocation } from "@/hooks/use-location"
import type { LocationData } from "@/lib/weather-api"

interface LocationSearchProps {
  onLocationSelect: (location: UserLocation) => void
  currentLocation?: UserLocation
}

export function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const {
    savedLocations,
    loading,
    error,
    getCurrentLocation,
    saveLocation,
    removeLocation,
    searchResults,
    searchLoading,
    searchLocation,
  } = useLocation()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchLocation(query)
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchLocation])

  const handleLocationSelect = (location: LocationData) => {
    const userLocation: UserLocation = {
      lat: location.lat,
      lon: location.lon,
      name: `${location.name}, ${location.country}`,
      isCurrentLocation: false,
    }
    onLocationSelect(userLocation)
    setQuery("")
    setIsOpen(false)
  }

  const handleCurrentLocationSelect = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation)
      setQuery("")
      setIsOpen(false)
    }
  }

  const handleSaveLocation = (location: LocationData, event: React.MouseEvent) => {
    event.stopPropagation()
    saveLocation(location)
  }

  const handleRemoveLocation = (location: LocationData, event: React.MouseEvent) => {
    event.stopPropagation()
    removeLocation(location)
  }

  const isLocationSaved = (location: LocationData) => {
    return savedLocations.some((saved) => saved.lat === location.lat && saved.lon === location.lon)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={getCurrentLocation}
          disabled={loading}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
          title="Use current location"
        >
          <Navigation className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {isOpen && (
        <Card className="absolute top-full z-50 mt-1 w-full">
          <CardContent className="p-0">
            {/* Current Location */}
            {currentLocation && (
              <div
                onClick={handleCurrentLocationSelect}
                className="flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-muted/50"
              >
                <Navigation className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLocation.lat.toFixed(2)}, {currentLocation.lon.toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary">GPS</Badge>
              </div>
            )}

            {/* Saved Locations */}
            {savedLocations.length > 0 && (
              <div className="border-b">
                <div className="p-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Saved Locations</p>
                </div>
                {savedLocations.map((location) => (
                  <div
                    key={`${location.lat}-${location.lon}`}
                    onClick={() => handleLocationSelect(location)}
                    className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted/50"
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <div className="flex-1">
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.state && `${location.state}, `}
                        {location.country}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleRemoveLocation(location, e)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {query.trim() && (
              <div>
                {searchLoading ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Search Results
                      </p>
                    </div>
                    {searchResults.map((location) => (
                      <div
                        key={`${location.lat}-${location.lon}`}
                        onClick={() => handleLocationSelect(location)}
                        className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted/50"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {location.state && `${location.state}, `}
                            {location.country}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleSaveLocation(location, e)}
                          disabled={isLocationSaved(location)}
                          className="h-8 w-8 p-0"
                        >
                          <Star
                            className={`h-3 w-3 ${isLocationSaved(location) ? "text-yellow-500 fill-current" : "text-muted-foreground"}`}
                          />
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-3 text-center text-sm text-muted-foreground">No locations found</div>
                )}
              </div>
            )}

            {!query.trim() && savedLocations.length === 0 && !currentLocation && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                Search for a city or use your current location
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
