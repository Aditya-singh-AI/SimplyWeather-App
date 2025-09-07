import { type NextRequest, NextResponse } from "next/server"
import { searchLocations } from "@/lib/weather-api-server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const locations = await searchLocations(query)
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Location search error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search locations" },
      { status: 500 },
    )
  }
}
