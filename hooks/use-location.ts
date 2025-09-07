"use client"

import { useState, useEffect, useCallback } from "react"
import { type LocationData, searchLocations } from "@/lib/weather-api"

export interface UserLocation {
  lat: number
  lon: number
  name?: string
  isCurrentLocation?: boolean
}

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weather-saved-locations")
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved))
      } catch (err) {
        console.error("Failed to parse saved locations:", err)
      }
    }
  }, [])

  // Save locations to localStorage
  const saveLocationsToStorage = useCallback((locations: LocationData[]) => {
    localStorage.setItem("weather-saved-locations", JSON.stringify(locations))
    setSavedLocations(locations)
  }, [])

  // Get current location using browser geolocation
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
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
        setCurrentLocation(location)
        setLoading(false)
      },
      (err) => {
        let errorMessage = "Failed to get location"
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
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
        maximumAge: 300000, // 5 minutes
      },
    )
  }, [])

  // Set location manually
  const setLocation = useCallback((location: UserLocation) => {
    setCurrentLocation(location)
    setError(null)
  }, [])

  // Add location to saved list
  const saveLocation = useCallback(
    (location: LocationData) => {
      const exists = savedLocations.some((saved) => saved.lat === location.lat && saved.lon === location.lon)
      if (!exists) {
        const newLocations = [...savedLocations, location]
        saveLocationsToStorage(newLocations)
      }
    },
    [savedLocations, saveLocationsToStorage],
  )

  // Remove location from saved list
  const removeLocation = useCallback(
    (location: LocationData) => {
      const newLocations = savedLocations.filter((saved) => !(saved.lat === location.lat && saved.lon === location.lon))
      saveLocationsToStorage(newLocations)
    },
    [savedLocations, saveLocationsToStorage],
  )

  // Search for locations
  const [searchResults, setSearchResults] = useState<LocationData[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const results = await searchLocations(query)
      setSearchResults(results)
    } catch (err) {
      console.error("Location search failed:", err)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  return {
    currentLocation,
    savedLocations,
    loading,
    error,
    getCurrentLocation,
    setLocation,
    saveLocation,
    removeLocation,
    searchResults,
    searchLoading,
    searchLocation,
  }
}
