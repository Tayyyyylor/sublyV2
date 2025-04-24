import { FrequencyType } from '@/types/global';
import React from 'react';
import { Text, View } from 'react-native';

interface EventProps {
  name: string;
  amount: number;
}

const EventCard = ({ name, amount }: EventProps) => {
  return (
    <View className="p-3 mb-2 bg-blue-100 rounded-lg">
      <Text className="font-bold text-blue-700">{name}</Text>
      <Text className="text-sm text-gray-700">{amount} €</Text>
    </View>
  );
};

export default EventCard;
