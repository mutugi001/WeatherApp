
import { Cloud, CloudSun, ThermometerSun, ThermometerSnowflake } from "lucide-react";

type WeatherType = "01d" | "04d" | "10d" | "13d" | "01n" | "04n" | "10n" | "13n";

export const WeatherIcon = ({ type, size = 56 }: { type: WeatherType; size?: number }) => {
  switch (type) {
    case "01d":
      return <ThermometerSun size={size} className="text-vividpurple" />;
    case "04d":
      return <Cloud size={size} className="text-vividpurple" />;
    case "13d":
      return <ThermometerSnowflake size={size} className="text-vividpurple" />;
    case "10d":
      return <Cloud size={size} className="text-blue-400" />;
    case "01n":
      return <ThermometerSun size={size} className="text-vividpurple" />;
    case "04n":
      return <Cloud size={size} className="text-vividpurple" />;
    case "13n" :
      return <ThermometerSnowflake size={size} className="text-vividpurple" />;
    case "10n":
      return <Cloud size={size} className="text-blue-400" />;
  }
};