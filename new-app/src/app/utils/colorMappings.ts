import { DepartureStatus } from "../components/sections/TrainDepartures";

// Severity-based color mappings (1-10 scale)
export const getSeverityStatusBarColor = (severity: number): string => {
  const severityColors: { [key: number]: string } = {
    1: "bg-red-900",
    2: "bg-red-800", 
    3: "bg-red-700",
    4: "bg-red-500",
    5: "bg-red-400",
    6: "bg-orange-400",
    7: "bg-orange-500",
    8: "bg-yellow-400",
    9: "bg-yellow-300",
    10: "bg-green-400",
  };
  return severityColors[severity] || "bg-gray-500";
};

export const getSeverityTextColor = (severity: number): string => {
  const severityColors: { [key: number]: string } = {
    1: "text-red-900 font-semibold",
    2: "text-red-800 font-semibold",
    3: "text-red-700 font-semibold",
    4: "text-red-500 font-semibold",
    5: "text-red-400 font-semibold",
    6: "text-orange-400 font-semibold",
    7: "text-orange-500 font-semibold",
    8: "text-yellow-400 font-semibold",
    9: "text-yellow-300 font-semibold",
    10: "text-green-400 font-semibold",
  };
  return severityColors[severity] || "text-gray-300";
};

export const getSeverityBorderColor = (severity: number): string => {
  const borderColors: { [key: number]: string } = {
    1: "border-red-900",
    2: "border-red-800",
    3: "border-red-700",
    4: "border-red-500",
    5: "border-red-400",
    6: "border-orange-400",
    7: "border-orange-500",
    8: "border-yellow-400",
    9: "border-yellow-300",
    10: "border-green-400",
  };
  return borderColors[severity] || "border-gray-500";
};

// Departure status-based color mappings
export const getDepartureStatusBarColor = (status: DepartureStatus): string => {
  switch (status) {
    case "On time":
      return "bg-green-500";
    case "Early":
      return "bg-blue-500";
    case "Late":
      return "bg-yellow-500";
    default:
      return "bg-red-500";
  }
};
