import React from "react";

const StatusBadge = ({ status = "available" }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "booked":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "occupied":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const formatText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle()}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "available"
            ? "bg-emerald-500 animate-pulse"
            : status === "booked"
            ? "bg-amber-500"
            : "bg-slate-500"
        }`}
      />
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
