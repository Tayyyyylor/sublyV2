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
      <Text className="font-bold text-slate-700 text-[18px] capitalize">
        {name}
      </Text>
      <Text className="text-sm text-blue-500 text-[14px] font-bold">
        {amount} €
      </Text>
    </TouchableOpacity>
  );
};

export default EventCard;
