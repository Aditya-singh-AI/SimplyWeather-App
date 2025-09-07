import { type NextRequest, NextResponse } from "next/server"
import { getCurrentWeather } from "@/lib/weather-api-server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const weatherData = await getCurrentWeather(Number.parseFloat(lat), Number.parseFloat(lon))
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch weather data" },
      { status: 500 },
    )
  }
}
