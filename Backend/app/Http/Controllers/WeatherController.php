<?php

namespace App\Http\Controllers;

// Import the INTERFACE
use App\Services\WeatherServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    // Type-hint the interface
    protected WeatherServiceInterface $weatherService;

    // Inject the Interface
    public function __construct(WeatherServiceInterface $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function showWeather($city = 'Nairobi,KE')
    {
        $weatherData = $this->weatherService->getCurrentWeather($city);

        //check whether data is fetched before returning
        if ($weatherData) {
            $temperature = $weatherData['main']['temp'] ?? 'N/A';
            $description = $weatherData['weather'][0]['description'] ?? 'N/A';
            return response()->json([
                    'city' => $city,
                    'weather' => $weatherData,
                    'temperature' => $temperature,
                    'description' => $description,
                ]);
        } else {

            Log::warning("Failed to fetch weather for city: {$city}");
            return response()->json([
                'error' => 'Unable to fetch weather data. Please try again later.'
            ], 500);
        }
    }

    // Add this method to fetch forecast data
    public function showForecast($city = 'Nairobi,KE')
    {
        $forecastData = $this->weatherService->getForecast($city);

        if ($forecastData) {
            return response()->json([
                'city' => $city,
                'forecast' => $forecastData,
            ]);
        } else {
            Log::warning("Failed to fetch forecast for city: {$city}");
            return response()->json([
                'error' => 'Unable to fetch forecast data. Please try again later.'
            ], 500);
        }
    }
}
