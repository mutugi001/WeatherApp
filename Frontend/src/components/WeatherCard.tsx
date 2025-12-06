
import { WeatherIcon } from "./WeatherIcon";

interface WeatherCardProps {
  icon: string;
  description: string;
  date: string;
  type: "sunny" | "cloudy" | "rain" | "snow" | "clear";
  min: number;
  max: number;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WeatherCard = ({ date, type, min, max }: WeatherCardProps) => {
  const d = new Date(date);
  const label = `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
  const dow = daysOfWeek[d.getDay()];

  return (
    <div className="bg-white rounded-xl shadow-lg py-4 px-6 flex flex-col items-center min-w-[120px] transition hover:scale-105 hover:shadow-xl animate-fade-in">
      <span className="font-semibold text-md text-gray-500">{label}</span>
      <span className="text-xs text-gray-400 mb-1">{dow}</span>
      <WeatherIcon type={type} size={36} />
      <div className="text-xs mt-3 space-x-2">
        <span className="text-vividpurple font-bold">{min}°</span>
        <span className="text-gray-500">-</span>
        <span className="text-blue-500 font-bold">{max}°C</span>
      </div>
    </div>
  );
};
