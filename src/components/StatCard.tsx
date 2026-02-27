import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

const borderClasses = {
  blue: "border-blue-200",
  green: "border-green-200",
  yellow: "border-yellow-200",
  purple: "border-purple-200",
  red: "border-red-200",
};

export default function StatCard({ title, value, unit, icon, color }: StatCardProps) {
  return (
    <div className={`${colorClasses[color]} border ${borderClasses[color]} rounded-lg p-4 hover:shadow-md transition`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold">
          {value}
          <span className="text-lg font-normal ml-1 text-gray-600">{unit}</span>
        </div>
      </div>
    </div>
  );
}
