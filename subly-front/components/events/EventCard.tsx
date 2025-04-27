import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface EventProps {
  id: string;
  name: string;
  amount: number;
  onPress: () => void;
}

const EventCard = ({ name, amount, onPress }: EventProps) => {
  return (
    <TouchableOpacity
      className="p-3 mb-2 bg-blue-100 rounded-lg"
      onPress={onPress}
    >
      <Text className="font-bold text-blue-700">{name}</Text>
      <Text className="text-sm text-gray-700">{amount} €</Text>
    </TouchableOpacity>
  );
};

export default EventCard;
