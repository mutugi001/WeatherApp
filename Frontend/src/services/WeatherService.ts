import apiClient from '@/api/axiosConfig';

import { AxiosError } from 'axios';
import { ApiError } from '@/types/api_errors'; // Adjust the import path as necessary
// Define or import the WeatherData type
interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    weather: [];
}





// --- Weather Service Functions ---

const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await apiClient.get<WeatherData>(`/weather/${city}`); // Replace with your actual API endpoint
    console.log('Weather fetched:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to fetch weather:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

const getForecast = async (city: string): Promise<WeatherData[]> => {
    try {
      const response = await apiClient.get<WeatherData[]>(`/forecast/${city}`); // Replace with your actual API endpoint
      console.log('Forecast fetched:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Failed to fetch forecast:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  };

// --- Exports ---


// Export weather functions
export const weatherService = {
  getCurrentWeather,
  getForecast
};

// Or export all combined if preferred:
// export const apiService = { ...authService, ...projectService, ...weatherService };

