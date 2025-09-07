// Client-side weather API functions that call our secure API routes
export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    uv_index: number
    wind_speed: number
    wind_direction: number
    weather_code: number
    weather_description: string
    icon: string
  }
  hourly: Array<{
    time: string
    temp: number
    weather_code: number
    icon: string
    precipitation_probability: number
  }>
  daily: Array<{
    date: string
    temp_max: number
    temp_min: number
    weather_code: number
    icon: string
    precipitation_probability: number
    sunrise: string
    sunset: string
  }>
  air_quality?: {
    aqi: number
    co: number
    no2: number
    o3: number
    pm2_5: number
    pm10: number
  }
}

export interface LocationData {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch weather data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to search locations")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching locations:", error)
    return []
  }
}

export function getWeatherIcon(code: number, isDay = true): string {
  // Map weather codes to appropriate icons
  const iconMap: { [key: number]: string } = {
    200: "⛈️", // thunderstorm with light rain
    201: "⛈️", // thunderstorm with rain
    202: "⛈️", // thunderstorm with heavy rain
    210: "🌩️", // light thunderstorm
    211: "🌩️", // thunderstorm
    212: "⛈️", // heavy thunderstorm
    221: "⛈️", // ragged thunderstorm
    230: "⛈️", // thunderstorm with light drizzle
    231: "⛈️", // thunderstorm with drizzle
    232: "⛈️", // thunderstorm with heavy drizzle
    300: "🌦️", // light intensity drizzle
    301: "🌦️", // drizzle
    302: "🌧️", // heavy intensity drizzle
    310: "🌦️", // light intensity drizzle rain
    311: "🌧️", // drizzle rain
    312: "🌧️", // heavy intensity drizzle rain
    313: "🌧️", // shower rain and drizzle
    314: "🌧️", // heavy shower rain and drizzle
    321: "🌧️", // shower drizzle
    500: "🌦️", // light rain
    501: "🌧️", // moderate rain
    502: "🌧️", // heavy intensity rain
    503: "🌧️", // very heavy rain
    504: "🌧️", // extreme rain
    511: "🌨️", // freezing rain
    520: "🌦️", // light intensity shower rain
    521: "🌧️", // shower rain
    522: "🌧️", // heavy intensity shower rain
    531: "🌧️", // ragged shower rain
    600: "🌨️", // light snow
    601: "❄️", // snow
    602: "❄️", // heavy snow
    611: "🌨️", // sleet
    612: "🌨️", // light shower sleet
    613: "🌨️", // shower sleet
    615: "🌨️", // light rain and snow
    616: "🌨️", // rain and snow
    620: "🌨️", // light shower snow
    621: "❄️", // shower snow
    622: "❄️", // heavy shower snow
    701: "🌫️", // mist
    711: "💨", // smoke
    721: "🌫️", // haze
    731: "💨", // sand/dust whirls
    741: "🌫️", // fog
    751: "💨", // sand
    761: "💨", // dust
    762: "🌋", // volcanic ash
    771: "💨", // squalls
    781: "🌪️", // tornado
    800: isDay ? "☀️" : "🌙", // clear sky
    801: isDay ? "🌤️" : "☁️", // few clouds
    802: "⛅", // scattered clouds
    803: "☁️", // broken clouds
    804: "☁️", // overcast clouds
  }

  return iconMap[code] || (isDay ? "☀️" : "🌙")
}
