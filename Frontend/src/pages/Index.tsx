import { useState, useEffect } from "react";
import { WeatherIcon } from "@/components/WeatherIcon";
import { WeatherCard } from "@/components/WeatherCard";
import { StatCard } from "@/components/StatCard";
import { Thermometer, Search, ArrowRight } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

const Index = () => {
  const [query, setQuery] = useState("Nairobi");
  const [unit, setUnit] = useState("C");
  const { forecastData, weatherData, isLoading, error, fetchWeather, fetchForecast } = useWeather();
  // const [forecast, setForecast] = useState<any[] | null>(null);

  // Fetch weather on mount and when query changes (on search)
  useEffect(() => {
    fetchWeather(query);
    fetchForecast(query).then(() => {
      // Optionally handle after fetch
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchWeather(query);
    fetchForecast(query);
  };

  // Temperature display logic
  const temp = weatherData?.temperature;
  const tempDisplay =
    typeof temp === "number"
      ? unit === "C"
        ? `${temp}°C`
        : `${Math.round((temp * 9) / 5 + 32)}°F`
      : "--";

  return (
    <div className="font-inter bg-softgray min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl p-6 bg-white rounded-3xl shadow-xl grid grid-cols-5 gap-8 animate-fade-in">
        {/* LEFT - Today's Weather */}
        <div className="col-span-2 flex flex-col items-center justify-center border-r pr-8">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : weatherData ? (
            <>
              <WeatherIcon type={weatherData.weather.weather[0].icon} size={88} />
              <div className="text-4xl font-bold mt-6 mb-2 text-vividpurple">{tempDisplay}</div>
              <div className="text-xl text-gray-600 mb-4">{weatherData.description ?? "--"}</div>
              <div className="mt-8 text-md text-gray-500">
                <span className="block font-bold text-gray-800">{weatherData.city ?? "--"}</span>
              </div>
            </>
          ) : (
            <div>No weather data available.</div>
          )}
        </div>
        {/* RIGHT - Search & Forecast & Stats */}
        <div className="col-span-3 flex flex-col h-full">
          {/* Search + unit switch row */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-vividpurple pr-12"
                placeholder="Search city..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
            <button
              className="ml-2 px-4 py-2 bg-vividpurple text-white rounded-lg font-medium shadow hover:bg-purple-700 focus:outline-none flex items-center gap-1"
              onClick={handleSearch}
            >
              GO
              <ArrowRight size={18} />
            </button>
            {/* Unit Switcher */}
            <div className="ml-2 flex rounded-lg bg-gray-100 border border-gray-300 overflow-hidden">
              <button
                className={`px-3 py-2 font-medium ${
                  unit === "C"
                    ? "bg-vividpurple text-white"
                    : "text-gray-600 hover:bg-vividpurple/10"
                }`}
                onClick={() => setUnit("C")}
              >
                °C
              </button>
              <button
                className={`px-3 py-2 font-medium ${
                  unit === "F"
                    ? "bg-vividpurple text-white"
                    : "text-gray-600 hover:bg-vividpurple/10"
                }`}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
          </div>
          {/* Forecast Cards */}
          <div className="flex gap-3 pb-3 overflow-x-auto mb-4 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Render forecast cards if forecast data is available */}
            {forecastData && Array.isArray(forecastData.forecast.list) && forecastData.forecast.list.length > 0 ? (
              forecastData.forecast.list.map((item: any, idx: number) => (
                <WeatherCard
                  key={idx}
                  date={item.dt_txt || item.date || idx}
                  type={item.weather?.[0]?.main?.toLowerCase() || "sunny"}
                  min={item.main?.temp_min ?? "--"}
                  max={item.main?.temp_max ?? "--"}
                  icon={item.weather?.[0]?.icon || "default-icon"}
                  description={item.weather?.[0]?.description || "No description available"}
                />
              ))
            ) : (
              <div className="text-gray-400">No forecast data available.</div>
            )}
          </div>
          {/* Stats: Wind & Humidity */}
          <div className="flex gap-4 mt-auto">
            {/* If wind/humidity available in weatherData, display here */}
            <StatCard label="Wind Status" value={weatherData?.weather.wind?.speed?.toString() ?? "--"} unit={"knots"}>
              <div className="flex items-center mt-3 gap-1 text-gray-400">
              </div>
            </StatCard>
            <StatCard label="Humidity" value={weatherData?.weather.main?.humidity?.toString() ?? "--"} unit="%">
              <div className="mt-4 bg-gray-200 rounded-full h-2 w-full relative">
                <div
                  className="bg-vividpurple h-2 rounded-full transition-all duration-500"
                  style={{ width: `${weatherData?.weather.main?.humidity ?? 0}%` }}
                ></div>
                <div className="absolute left-0 top-0 text-xs text-gray-400 -mt-5">0</div>
                <div className="absolute right-0 top-0 text-xs text-gray-400 -mt-5">100</div>
              </div>
            </StatCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
