<?php

namespace App\Services;

interface WeatherServiceInterface
{
    /**
     * Get current weather data for a given city.
     *
     * @param string $city The city name (e.g., "Nairobi,KE").
     * @param string $units The unit format (metric, imperial). Default is metric.
     * @return array|null Returns weather data array on success, null on failure.
     */
    public function getCurrentWeather(string $city, string $units = 'metric'): ?array;

    public function getForecast(string $city, string $units = 'metric'): ?array;

    // Add methods for other weather APIs here (e.g., getForecast)
    // public function getForecast(string $city, string $units = 'metric'): ?array;
}
