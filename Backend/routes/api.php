<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('weather')->controller(WeatherController::class)->group(function () {
    Route::get('/weather', 'showWeather')->name('weather.show');
    Route::get('/weather/{city}', 'showWeather')->name('weather.show.city');
    Route::get('/forecast', 'showForecast')->name('weather.forecast');
    Route::get('/forecast/{city}', 'showForecast')->name('weather.forecast.city');
});
// Route::prefix('projects')->controller(ProjectController::class)->group(function() {
//     Route::get('/index', 'index')->name('projects.index');
//     Route::post('/store', 'store')->name('projects.store');
//     Route::post('/{project}/show', 'show')->name('projects.show');
//     Route::post('/{project}/update', 'update')->name('projects.update');
//     Route::delete('/{project}/destroy', 'destroy')->name('projects.destroy');
// });
