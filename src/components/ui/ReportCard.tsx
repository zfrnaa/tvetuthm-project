import React from "react";

interface ReportCardProps {
  title: string;
  value: string;
  icon?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, value, icon }) => (
  <div className="bg-white w-48 p-4 rounded-2xl shadow-xs m-2">
    <p className="text-2xl">{icon}</p>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

export default ReportCard;
