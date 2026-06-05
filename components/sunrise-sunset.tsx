"use client"

import { Sunrise, Sunset } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SunriseSunsetProps {
  sunrise: string
  sunset: string
  className?: string
}

export function SunriseSunset({ sunrise, sunset, className }: SunriseSunsetProps) {
  const now = new Date()
  const sunriseDate = new Date(sunrise)
  const sunsetDate = new Date(sunset)

  const totalDaylight = sunsetDate.getTime() - sunriseDate.getTime()
  const elapsed = now.getTime() - sunriseDate.getTime()
  const progress = Math.max(0, Math.min(1, elapsed / totalDaylight))

  const isDaytime = now >= sunriseDate && now <= sunsetDate
  const daylightHours = Math.floor(totalDaylight / (1000 * 60 * 60))
  const daylightMinutes = Math.floor((totalDaylight % (1000 * 60 * 60)) / (1000 * 60))

  // Calculate sun position on the arc
  const angle = Math.PI * progress // 0 to PI (left to right)
  const arcCenterX = 50
  const arcCenterY = 75
  const arcRadius = 38
  const sunX = arcCenterX - arcRadius * Math.cos(angle)
  const sunY = arcCenterY - arcRadius * Math.sin(angle)

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Generate arc path
  const arcPath = `M ${arcCenterX - arcRadius} ${arcCenterY} A ${arcRadius} ${arcRadius} 0 0 1 ${arcCenterX + arcRadius} ${arcCenterY}`

  // Generate progress arc path
  const progressEndX = arcCenterX - arcRadius * Math.cos(angle)
  const progressEndY = arcCenterY - arcRadius * Math.sin(angle)
  const largeArcFlag = progress > 0.5 ? 1 : 0
  const progressPath = `M ${arcCenterX - arcRadius} ${arcCenterY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${progressEndX} ${progressEndY}`

  return (
    <Card className={`overflow-hidden border-0 bg-card/60 backdrop-blur-md shadow-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isDaytime ? (
            <Sunrise className="h-4 w-4 text-amber-500" />
          ) : (
            <Sunset className="h-4 w-4 text-orange-500" />
          )}
          {isDaytime ? "Daylight" : "Nighttime"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative w-full" style={{ paddingBottom: "55%" }}>
          <svg
            viewBox="0 0 100 80"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Background arc (track) */}
            <path
              d={arcPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              className="text-muted-foreground/20"
            />

            {/* Progress arc */}
            {isDaytime && progress > 0 && (
              <path
                d={progressPath}
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Horizon line */}
            <line
              x1={arcCenterX - arcRadius - 5}
              y1={arcCenterY}
              x2={arcCenterX + arcRadius + 5}
              y2={arcCenterY}
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-muted-foreground/30"
            />

            {/* Sun/Moon */}
            {isDaytime && (
              <>
                <circle
                  cx={sunX}
                  cy={sunY}
                  r="6"
                  fill="url(#sunHalo)"
                >
                  <animate
                    attributeName="r"
                    values="5;7;5"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={sunX}
                  cy={sunY}
                  r="2.5"
                  fill="url(#sunGlow)"
                  stroke="#fbbf24"
                  strokeWidth="0.3"
                />
              </>
            )}

            {!isDaytime && (
              <>
                <circle
                  cx={arcCenterX}
                  cy={arcCenterY - arcRadius * 0.7}
                  r="3"
                  fill="#94a3b8"
                  opacity="0.8"
                />
                <circle
                  cx={arcCenterX - 1}
                  cy={arcCenterY - arcRadius * 0.7 - 1}
                  r="2.5"
                  fill="var(--background)"
                />
              </>
            )}

            {/* Sunrise icon position */}
            <text
              x={arcCenterX - arcRadius}
              y={arcCenterY + 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="3"
            >
              {formatTime(sunrise)}
            </text>

            {/* Sunset icon position */}
            <text
              x={arcCenterX + arcRadius}
              y={arcCenterY + 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="3"
            >
              {formatTime(sunset)}
            </text>
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Sunrise className="h-3 w-3 text-amber-500" />
            <span>Sunrise</span>
          </div>
          <span className="font-medium text-foreground">
            {daylightHours}h {daylightMinutes}m daylight
          </span>
          <div className="flex items-center gap-1">
            <Sunset className="h-3 w-3 text-orange-500" />
            <span>Sunset</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
