"use client"

import { useState } from "react"
import { Settings, Thermometer, Bell, Palette, Clock, Wind, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettings } from "@/hooks/use-settings"
import { useTheme } from "next-themes"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const { settings, updateSetting, updateNotificationSetting, resetSettings } = useSettings()
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    updateSetting("theme", newTheme as "light" | "dark" | "system")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your weather app experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Temperature Unit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Thermometer className="h-4 w-4" />
                Temperature Unit
              </CardTitle>
              <CardDescription>Choose how temperatures are displayed</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={settings.temperatureUnit}
                onValueChange={(value) => updateSetting("temperatureUnit", value as "celsius" | "fahrenheit")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>Choose your preferred theme</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Data & Refresh */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wind className="h-4 w-4" />
                Data & Updates
              </CardTitle>
              <CardDescription>Control how often data is refreshed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Refresh Interval</Label>
                <Select
                  value={settings.refreshInterval.toString()}
                  onValueChange={(value) => updateSetting("refreshInterval", Number.parseInt(value))}
                >
                  <SelectTrigger>
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-detect Location</Label>
                  <p className="text-sm text-muted-foreground">Automatically use your current location</p>
                </div>
                <Switch
                  checked={settings.autoLocation}
                  onCheckedChange={(checked) => updateSetting("autoLocation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Air Quality</Label>
                  <p className="text-sm text-muted-foreground">Display air quality information</p>
                </div>
                <Switch
                  checked={settings.showAirQuality}
                  onCheckedChange={(checked) => updateSetting("showAirQuality", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Time Format
              </CardTitle>
              <CardDescription>Choose how time is displayed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>24-Hour Time</Label>
                  <p className="text-sm text-muted-foreground">Use 24-hour format instead of 12-hour</p>
                </div>
                <Switch
                  checked={settings.show24HourTime}
                  onCheckedChange={(checked) => updateSetting("show24HourTime", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Allow weather notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateNotificationSetting("enabled", checked)}
                />
              </div>

              {settings.notifications.enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Forecast</Label>
                        <p className="text-sm text-muted-foreground">Morning weather summary</p>
                      </div>
                      <Switch
                        checked={settings.notifications.dailyForecast}
                        onCheckedChange={(checked) => updateNotificationSetting("dailyForecast", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Severe Weather</Label>
                        <p className="text-sm text-muted-foreground">Alerts for severe weather conditions</p>
                      </div>
                      <Switch
                        checked={settings.notifications.severeWeather}
                        onCheckedChange={(checked) => updateNotificationSetting("severeWeather", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Rain Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify when rain is expected</p>
                      </div>
                      <Switch
                        checked={settings.notifications.rainAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting("rainAlerts", checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RotateCcw className="h-4 w-4" />
                Reset Settings
              </CardTitle>
              <CardDescription>Restore all settings to their default values</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={resetSettings} className="w-full bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
