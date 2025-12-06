
import { ReactNode } from "react";

export const StatCard = ({
  label,
  value,
  unit,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  children?: ReactNode;
}) => (
  <div className="flex flex-col bg-white rounded-xl shadow-lg px-6 py-4 w-full min-h-[110px]">
    <span className="text-gray-500 font-semibold mb-2">{label}</span>
    <span className="text-2xl font-bold text-vividpurple">{value}{unit && <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>}</span>
    {children}
  </div>
);
