<?php

namespace App\Providers;

use App\Services\WeatherServiceInterface; // Import the interface
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http; // Import the HTTP facade
use Illuminate\Support\Facades\Log; // Import the Log facade
use Illuminate\Support\Facades\Config; // Import the Config facade

class WeatherServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind the WeatherServiceInterface interface to a closure
        // This closure will return an object (an anonymous class instance)
        // that performs the weather fetching logic.
        $this->app->singleton(WeatherServiceInterface::class, function ($app) {
            // Get config values here within the closure
            $apiKey = Config::get('services.openweathermap.api_key');
            $baseUrl = Config::get('services.openweathermap.base_url');

            // Return an anonymous class instance that implements the interface
            return new class($apiKey, $baseUrl) implements WeatherServiceInterface {
                protected $apiKey;
                protected $baseUrl;

                // The constructor receives config values from the closure
                public function __construct(string $apiKey, string $baseUrl)
                {
                    $this->apiKey = $apiKey;
                    $this->baseUrl = $baseUrl;
                }

                /**
                 * Implement the interface method
                 */
                public function getCurrentWeather(string $city, string $units = 'metric'): ?array
                {
                    if (empty($this->apiKey)) {
                        Log::error('OpenWeatherMap API Key is not set in services.openweathermap.api_key.');
                        return null; // Indicate failure
                    }

                    $url = rtrim($this->baseUrl, '/') . '/weather';

                    try {
                        $response = Http::get($url, [
                            'q' => $city,
                            'appid' => $this->apiKey,
                            'units' => $units,
                        ]);

                        if ($response->successful()) {
                            return $response->json();
                        } else {
                             Log::error('OpenWeatherMap API Error:', [
                                'status' => $response->status(),
                                'body' => $response->body(),
                                'city' => $city,
                                'url' => $url,
                            ]);
                            return null;
                        }
                    } catch (\Exception $e) {
                         Log::error('HTTP Request Exception for OpenWeatherMap:', [
                            'message' => $e->getMessage(),
                            'city' => $city,
                            'url' => $url,
                        ]);
                        return null;
                    }
                }
                public function getForecast(string $city, string $units = 'metric'): ?array
                {
                     if (empty($this->apiKey)) {
                        Log::error('OpenWeatherMap API Key is not set for forecast.');
                        return null; // Indicate failure
                    }

                    // Use the 'forecast' endpoint
                    $url = rtrim($this->baseUrl, '/') . '/forecast'; // This is the 5-day / 3-hour forecast endpoint

                    try {
                        $response = Http::get($url, [
                            'q' => $city,
                            'appid' => $this->apiKey,
                            'units' => $units, // 'metric' or 'imperial'
                            // You might add other parameters here, e.g., 'cnt' for a specific number of timestamps
                        ]);

                        if ($response->successful()) {
                            return $response->json();
                        } else {
                             Log::error('OpenWeatherMap API Error [Forecast]:', [
                                'status' => $response->status(),
                                'body' => $response->body(),
                                'city' => $city,
                                'url' => $url,
                            ]);
                            return null;
                        }
                    } catch (\Exception $e) {
                         Log::error('HTTP Request Exception [Forecast]:', [
                            'message' => $e->getMessage(),
                            'city' => $city,
                            'url' => $url,
                        ]);
                        return null;
                    }
                }
            };
        });
    }

                // Implement other interface methods here if any

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
