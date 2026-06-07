"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

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
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12 h-9 rounded-xl bg-muted/30 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all text-sm"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={getCurrentLocation}
          disabled={loading}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 rounded-lg hover:bg-accent/10"
          title="Use current location"
        >
          <Navigation className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {isOpen && (
        <Card className="absolute top-full z-50 mt-1.5 w-full glass-card border-0 rounded-xl shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Current Location */}
            {currentLocation && (
              <div
                onClick={handleCurrentLocationSelect}
                className="flex cursor-pointer items-center gap-3 border-b border-border/30 p-3 hover:bg-accent/5 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Navigation className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-xs text-muted-foreground">
                    {currentLocation.lat.toFixed(2)}, {currentLocation.lon.toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent border-accent/20">GPS</Badge>
              </div>
            )}

            {/* Saved Locations */}
            {savedLocations.length > 0 && (
              <div className="border-b border-border/30">
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Saved</p>
                </div>
                {savedLocations.map((location) => (
                  <div
                    key={`${location.lat}-${location.lon}`}
                    onClick={() => handleLocationSelect(location)}
                    className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-current shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{location.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {location.state && `${location.state}, `}
                        {location.country}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleRemoveLocation(location, e)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg"
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
                  <div className="p-4 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Searching...
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-3 pt-2 pb-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Results
                      </p>
                    </div>
                    {searchResults.map((location) => (
                      <div
                        key={`${location.lat}-${location.lon}`}
                        onClick={() => handleLocationSelect(location)}
                        className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent/5 transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{location.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {location.state && `${location.state}, `}
                            {location.country}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleSaveLocation(location, e)}
                          disabled={isLocationSaved(location)}
                          className="h-7 w-7 p-0 rounded-lg"
                        >
                          <Star
                            className={`h-3 w-3 ${isLocationSaved(location) ? "text-amber-500 fill-current" : "text-muted-foreground"}`}
                          />
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No locations found</div>
                )}
              </div>
            )}

            {!query.trim() && savedLocations.length === 0 && !currentLocation && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Search for a city or use your current location
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
