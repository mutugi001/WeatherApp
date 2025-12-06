// types/weather.ts

// --- Reusable Interfaces for Nested Objects ---

interface Coordinates {
    lat: number; // Latitude
    lon: number; // Longitude
}

interface WeatherCondition {
    id: number; // Weather condition id
    main: string; // Group of weather parameters (Rain, Snow, Clouds etc.)
    description: string; // Weather condition within the group (e.g. "scattered clouds")
    icon: string; // Weather icon id
}

interface MainWeatherData {
    temp: number; // Temperature (in Kelvin, Celsius, or Fahrenheit depending on 'units' parameter)
    feels_like: number; // Feels like temperature
    temp_min: number; // Minimum temperature at the moment
    temp_max: number; // Maximum temperature at the moment
    pressure: number; // Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level)
    humidity: number; // Humidity, %
    sea_level?: number; // Atmospheric pressure on the sea level, hPa (optional)
    grnd_level?: number; // Atmospheric pressure on the ground level, hPa (optional)
}

interface WindData {
    speed: number; // Wind speed (in m/s, km/h, or mph depending on 'units')
    deg: number; // Wind direction, degrees (meteorological)
    gust?: number; // Wind gust speed (optional)
}

interface CloudData {
    all: number; // Cloudiness, %
}

interface SystemData {
    type: number; // Internal parameter
    id: number; // Internal parameter
    country: string; // Country code (GB, JP etc.)
    sunrise: number; // Sunrise time, Unix, UTC
    sunset: number; // Sunset time, Unix, UTC
}

// --- Type for the Raw Current Weather API Response ---

// This matches the top-level structure of the /data/2.5/weather response
export interface CurrentWeatherResponse {
    coord: Coordinates;
    weather: WeatherCondition[]; // Array of weather conditions (usually one item)
    base: string; // Internal parameter
    main: MainWeatherData;
    visibility: number; // Visibility, meter
    wind: WindData;
    clouds: CloudData;
    dt: number; // Time of data calculation, Unix, UTC
    sys: SystemData;
    timezone: number; // Shift in seconds from UTC
    id: number; // City ID
    name: string; // City name
    cod: number; // Internal OpenWeatherMap status code (200 for success)
    message?: string; // Message on error (present for non-200 cod)
}

// --- Interfaces for Forecast Data ---

interface ForecastCity {
    id: number; // City ID
    name: string; // City name
    coord: Coordinates;
    country: string; // Country code
    timezone: number; // Shift in seconds from UTC
    sunrise: number; // Sunrise time, Unix, UTC
    sunset: number; // Sunset time, Unix, UTC
}

interface ForecastSystemData {
    pod: string; // Part of the day (d - day, n - night)
}

// This matches each item in the 'list' array of the forecast response
export interface ForecastItem {
    dt: number; // Time of data calculation, Unix, UTC
    main: MainWeatherData; // Contains temp, humidity, pressure etc. for this time point
    weather: WeatherCondition[]; // Array of weather conditions
    clouds: CloudData;
    wind: WindData;
    visibility: number; // Visibility, meter
    pop: number; // Probability of precipitation
    sys: ForecastSystemData;
    dt_txt: string; // Date and time in UTC, format YYYY-MM-DD HH:mm:ss
    rain?: { '3h': number }; // Rain volume for last 3 hours (optional)
    snow?: { '3h': number }; // Snow volume for last 3 hours (optional)
}

// --- Type for the Raw 5-day / 3-hour Forecast API Response ---

// This matches the top-level structure of the /data/2.5/forecast response
export interface WeatherForecastResponse {
    cod: string; // Internal OpenWeatherMap status code (e.g., "200" as a string)
    message: number; // Internal parameter
    cnt: number; // Number of timestamps returned in the list
    list: ForecastItem[]; // Array of forecast entries
    city: ForecastCity; // Information about the city
}


// --- Optional: Types for derived data used in your UI components ---
// These are not the raw API types, but might be useful for passing processed data to components

// Example of a type for the simplified "Current Weather" display data
export interface ProcessedCurrentWeather {
    temperature: number; // Already converted to C or F
    unit: 'C' | 'F';
    condition: string; // e.g., "Clear", "Clouds"
    description: string; // e.g., "clear sky", "scattered clouds"
    iconCode: string; // OWM icon code (e.g., "01d") - useful for mapping to actual icons
    city: string;
    country: string;
    date: Date; // JavaScript Date object
    humidity: number; // %
    windSpeed: number; // Already converted to km/h or mph
    windUnit: 'km/h' | 'mph';
    windDirectionDegrees: number; // Raw degrees from API
    // Add other derived fields as needed
}

// Example of a type for a single processed "Forecast Day" display item
export interface ProcessedForecastDay {
     date: Date; // JavaScript Date object (often representing the day)
     iconCode: string; // OWM icon code for the day's main condition
     description: string; // Main description for the day
     tempMin: number; // Min temp for the day (in C or F)
     tempMax: number; // Max temp for the day (in C or F)
     // You might include average wind, humidity etc. for the day here too
}

// Example of a type for the array of processed forecast days
export type ProcessedForecastData = ProcessedForecastDay[];