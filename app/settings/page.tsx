"use client"

import { useState, useEffect } from "react"
import { Settings, Thermometer, Bell, Palette, Clock, Wind, RotateCcw, Sun, Moon, Monitor, Info, Heart, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WeatherBackground } from "@/components/weather-background"
import { useSettings } from "@/hooks/use-settings"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { settings, updateSetting, updateNotificationSetting, resetSettings } = useSettings()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    updateSetting("theme", newTheme as "light" | "dark" | "system")
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" />, desc: "Bright and clean" },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" />, desc: "Easy on the eyes" },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" />, desc: "Match your device" },
  ]

  return (
    <div className="min-h-screen relative">
      <WeatherBackground />

      <div className="relative z-10 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-3xl">
          {/* Header */}
          <header
            className={`mb-6 sm:mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Settings className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text">Settings</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Customize your weather experience</p>
              </div>
            </div>
          </header>

          <div className="space-y-4 page-enter">
            {/* Temperature Unit */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="p-1.5 rounded-xl bg-rose-500/10">
                    <Thermometer className="h-4 w-4 text-rose-500" />
                  </div>
                  Temperature Unit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "celsius", label: "Celsius", symbol: "°C" },
                    { value: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
                  ].map((unit) => (
                    <button
                      key={unit.value}
                      onClick={() => updateSetting("temperatureUnit", unit.value as "celsius" | "fahrenheit")}
                      className={`p-4 rounded-xl text-center transition-all duration-300 border cursor-pointer ${
                        settings.temperatureUnit === unit.value
                          ? "bg-accent/10 border-accent/30 text-accent ring-1 ring-accent/20"
                          : "bg-muted/30 border-border/30 hover:bg-muted/50"
                      }`}
                    >
                      <p className="text-2xl font-extralight mb-1">{unit.symbol}</p>
                      <p className="text-xs font-medium">{unit.label}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="p-1.5 rounded-xl bg-violet-500/10">
                    <Palette className="h-4 w-4 text-violet-500" />
                  </div>
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleThemeChange(opt.value)}
                      className={`p-4 rounded-xl text-center transition-all duration-300 border cursor-pointer ${
                        theme === opt.value
                          ? "bg-accent/10 border-accent/30 text-accent ring-1 ring-accent/20"
                          : "bg-muted/30 border-border/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex justify-center mb-2">{opt.icon}</div>
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data & Updates */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="p-1.5 rounded-xl bg-sky-500/10">
                    <Wind className="h-4 w-4 text-sky-500" />
                  </div>
                  Data & Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm">Refresh Interval</Label>
                  <Select
                    value={settings.refreshInterval.toString()}
                    onValueChange={(value) => updateSetting("refreshInterval", Number.parseInt(value))}
                  >
                    <SelectTrigger className="rounded-xl bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                      <SelectItem value="120">Every 2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="opacity-30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-detect Location</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Use your current location automatically</p>
                  </div>
                  <Switch
                    checked={settings.autoLocation}
                    onCheckedChange={(checked) => updateSetting("autoLocation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Air Quality</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Display air quality information</p>
                  </div>
                  <Switch
                    checked={settings.showAirQuality}
                    onCheckedChange={(checked) => updateSetting("showAirQuality", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Format */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="p-1.5 rounded-xl bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  Time Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>24-Hour Time</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Use 24-hour format instead of 12-hour</p>
                  </div>
                  <Switch
                    checked={settings.show24HourTime}
                    onCheckedChange={(checked) => updateSetting("show24HourTime", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <div className="p-1.5 rounded-xl bg-emerald-500/10">
                    <Bell className="h-4 w-4 text-emerald-500" />
                  </div>
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Allow weather notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) => updateNotificationSetting("enabled", checked)}
                  />
                </div>

                {settings.notifications.enabled && (
                  <>
                    <Separator className="opacity-30" />
                    <div className="space-y-4">
                      {[
                        { key: "dailyForecast" as const, label: "Daily Forecast", desc: "Morning weather summary" },
                        { key: "severeWeather" as const, label: "Severe Weather", desc: "Alerts for severe conditions" },
                        { key: "rainAlerts" as const, label: "Rain Alerts", desc: "Notify when rain is expected" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <Label>{item.label}</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </div>
                          <Switch
                            checked={settings.notifications[item.key]}
                            onCheckedChange={(checked) => updateNotificationSetting(item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Reset */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardContent className="p-5">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="w-full bg-transparent rounded-xl gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="glass-card border-0 rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-3">🌤️</div>
                <h3 className="text-sm font-bold gradient-text-accent mb-1">SimplyWeather</h3>
                <p className="text-xs text-muted-foreground mb-3">Version 1.0.0</p>
                <p className="text-xs text-muted-foreground/60">
                  Made with <Heart className="h-3 w-3 inline text-red-400" /> by Aditya Singh
                </p>
              </CardContent>
            </Card>
          </div>

          <footer className="text-center py-8 text-xs text-muted-foreground/40">
            <p>SimplyWeather • Made By Aditya Singh With ❤️ and ☕</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
