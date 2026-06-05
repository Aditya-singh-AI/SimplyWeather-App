"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { WeatherData } from "@/lib/weather-api"

interface ForecastChartProps {
  hourly: WeatherData["hourly"]
  className?: string
}

export function ForecastChart({ hourly, className }: ForecastChartProps) {
  const chartData = hourly.slice(0, 12).map((hour, index) => ({
    time: new Date(hour.time).toLocaleTimeString([], { hour: "2-digit" }),
    temperature: hour.temp,
    precipitation: hour.precipitation_probability,
  }))

  const tempTrend = chartData.length > 1 ? chartData[chartData.length - 1].temperature - chartData[0].temperature : 0

  const chartConfig = {
    temperature: {
      label: "Temperature",
      color: "hsl(var(--primary))",
    },
    precipitation: {
      label: "Precipitation",
      color: "hsl(var(--secondary))",
    },
  }

  return (
    <Card className={`glass-card border-0 rounded-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className={`p-1.5 rounded-lg ${tempTrend >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
            {tempTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-500" />
            )}
          </div>
          Temperature Trend
        </CardTitle>
        <CardDescription className="text-xs">
          Next 12 hours • {tempTrend >= 0 ? "Rising" : "Falling"} by {Math.abs(tempTrend).toFixed(1)}°
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(value) => `Time: ${value}`} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#temperatureGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
