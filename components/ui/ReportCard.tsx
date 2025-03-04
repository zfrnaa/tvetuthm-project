import React from "react";
import { View, Text } from "react-native";

interface ReportCardProps {
  title: string;
  value: string;
  icon: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, value, icon }) => (
  <View className="bg-white w-48 p-4 rounded-2xl shadow-xs m-2">
    <Text className="text-2xl">{icon}</Text>
    <Text className="text-gray-600 text-sm">{title}</Text>
    <Text className="text-2xl font-bold text-blue-600">{value}</Text>
  </View>
);

export default ReportCard;
