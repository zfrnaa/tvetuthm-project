import React from "react";
import { View, Text } from "react-native";

interface CardProps {
  title: string;
  content: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ title, content, subtitle }) => {
  return (
    <View className="p-4 bg-white/50 backdrop-blur-md rounded-lg max-h-32">
      <Text className="text-lg font-semibold text-gray-700 flex-1 max-w-xs" style={{ color: '#575757', overflow: 'hidden'}} numberOfLines={2}>{title}</Text>
      <Text className="text-sm text-gray-600">{content}</Text>
      <Text className="text-sm text-gray-600">{subtitle}</Text>
    </View>
  );
};

export default Card;