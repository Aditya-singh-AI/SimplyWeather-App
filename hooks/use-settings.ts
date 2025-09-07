"use client"

import { useState, useEffect, useCallback } from "react"

export interface WeatherSettings {
  temperatureUnit: "celsius" | "fahrenheit"
  theme: "light" | "dark" | "system"
  refreshInterval: number // in minutes
  notifications: {
    enabled: boolean
    dailyForecast: boolean
    severeWeather: boolean
    rainAlerts: boolean
  }
  autoLocation: boolean
  showAirQuality: boolean
  show24HourTime: boolean
}

const defaultSettings: WeatherSettings = {
  temperatureUnit: "celsius",
  theme: "system",
  refreshInterval: 30,
  notifications: {
    enabled: false,
    dailyForecast: false,
    severeWeather: true,
    rainAlerts: false,
  },
  autoLocation: true,
  showAirQuality: true,
  show24HourTime: true,
}

const SETTINGS_KEY = "weather-app-settings"

export function useSettings() {
  const [settings, setSettings] = useState<WeatherSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: WeatherSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }, [])

  // Update specific setting
  const updateSetting = useCallback(
    <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => {
      const newSettings = { ...settings, [key]: value }
      saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  // Update nested notification setting
  const updateNotificationSetting = useCallback(
    <K extends keyof WeatherSettings["notifications"]>(key: K, value: WeatherSettings["notifications"][K]) => {
      const newSettings = {
        ...settings,
        notifications: { ...settings.notifications, [key]: value },
      }
      saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  // Reset to defaults
  const resetSettings = useCallback(() => {
    saveSettings(defaultSettings)
  }, [saveSettings])

  // Temperature conversion utilities
  const convertTemperature = useCallback(
    (temp: number, fromUnit: "celsius" | "fahrenheit" = "celsius") => {
      if (settings.temperatureUnit === fromUnit) return temp

      if (fromUnit === "celsius" && settings.temperatureUnit === "fahrenheit") {
        return Math.round((temp * 9) / 5 + 32)
      }

      if (fromUnit === "fahrenheit" && settings.temperatureUnit === "celsius") {
        return Math.round(((temp - 32) * 5) / 9)
      }

      return temp
    },
    [settings.temperatureUnit],
  )

  const getTemperatureSymbol = useCallback(() => {
    return settings.temperatureUnit === "celsius" ? "°C" : "°F"
  }, [settings.temperatureUnit])

  // Format time based on user preference
  const formatTime = useCallback(
    (date: Date | string) => {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !settings.show24HourTime,
      })
    },
    [settings.show24HourTime],
  )

  return {
    settings,
    loading,
    updateSetting,
    updateNotificationSetting,
    resetSettings,
    convertTemperature,
    getTemperatureSymbol,
    formatTime,
  }
}
