// Client-side weather API functions
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

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not configured")
  }

  try {
    const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
    ])

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const currentData = await currentResponse.json()
    const forecastData = await forecastResponse.json()
    const airQualityData = airQualityResponse.ok ? await airQualityResponse.json() : null

    const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
      time: item.dt_txt,
      temp: Math.round(item.main.temp),
      weather_code: item.weather[0].id,
      icon: item.weather[0].icon,
      precipitation_probability: Math.round((item.pop || 0) * 100),
    }))

    const dailyMap = new Map()
    forecastData.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          temps: [item.main.temp],
          weather_code: item.weather[0].id,
          icon: item.weather[0].icon,
          precipitation_probability: Math.round((item.pop || 0) * 100),
          sunrise: new Date(currentData.sys.sunrise * 1000).toISOString(),
          sunset: new Date(currentData.sys.sunset * 1000).toISOString(),
        })
      } else {
        dailyMap.get(date).temps.push(item.main.temp)
      }
    })

    const daily = Array.from(dailyMap.values())
      .slice(0, 7)
      .map((day: any) => ({
        date: day.date,
        temp_max: Math.round(Math.max(...day.temps)),
        temp_min: Math.round(Math.min(...day.temps)),
        weather_code: day.weather_code,
        icon: day.icon,
        precipitation_probability: day.precipitation_probability,
        sunrise: day.sunrise,
        sunset: day.sunset,
      }))

    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        visibility: Math.round(currentData.visibility / 1000),
        uv_index: 0,
        wind_speed: Math.round(currentData.wind.speed * 3.6),
        wind_direction: currentData.wind.deg,
        weather_code: currentData.weather[0].id,
        weather_description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      hourly,
      daily,
      air_quality: airQualityData
        ? {
            aqi: airQualityData.list[0].main.aqi,
            co: airQualityData.list[0].components.co,
            no2: airQualityData.list[0].components.no2,
            o3: airQualityData.list[0].components.o3,
            pm2_5: airQualityData.list[0].components.pm2_5,
            pm10: airQualityData.list[0].components.pm10,
          }
        : undefined,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!API_KEY || !query.trim()) {
    return []
  }

  try {
    const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to search locations")
    }

    const data = await response.json()
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }))
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
