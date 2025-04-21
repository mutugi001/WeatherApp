import { createContext, useState, useContext, ReactNode } from 'react';
import {
  CurrentWeatherResponse,
  WeatherForecastResponse,
  ProcessedForecastData,
  ProcessedForecastDay,
} from '../types/weather';
import { weatherService } from '../services/WeatherService';

interface WeatherContextProps {
  weatherData: CurrentWeatherResponse | null;
  forecastData: WeatherForecastResponse | null;
  processedForecast: ProcessedForecastData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (city: string) => Promise<void>;
  fetchForecast: (city: string) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

// Helper to process raw forecast into daily summaries
function processForecast(raw: WeatherForecastResponse | null): ProcessedForecastData | null {
  if (!raw || !raw.list) return null;
  // Group by date (YYYY-MM-DD)
  const days: { [date: string]: ProcessedForecastDay } = {};
  raw.list.forEach(item => {
    const dateStr = item.dt_txt.split(' ')[0];
    if (!days[dateStr]) {
      days[dateStr] = {
        date: new Date(dateStr),
        iconCode: item.weather[0].icon,
        description: item.weather[0].description,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
      };
    } else {
      days[dateStr].tempMin = Math.min(days[dateStr].tempMin, item.main.temp_min);
      days[dateStr].tempMax = Math.max(days[dateStr].tempMax, item.main.temp_max);
    }
  });
  return Object.values(days);
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecastResponse | null>(null);
  const [processedForecast, setProcessedForecast] = useState<ProcessedForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await weatherService.getCurrentWeather(city);
      setWeatherData(data as CurrentWeatherResponse);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch weather.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecast = async (city: string) => {
    setIsLoading(true);
    setError(null);
    setForecastData(null);
    setProcessedForecast(null);

    try {
      const data = await weatherService.getForecast(city);
      setForecastData(data as WeatherForecastResponse);
      setProcessedForecast(processForecast(data as WeatherForecastResponse));
      console.log("Fetched Forecast Data:", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch forecast.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WeatherContext.Provider value={{ forecastData, weatherData, processedForecast, isLoading, error, fetchWeather, fetchForecast }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
