import { EventType } from '@/types/global';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface EventProps {
  id: string;
  data: EventType;
  onPress: () => void;
}

const EventCard = ({ data, onPress }: EventProps) => {
  return (
    <TouchableOpacity
      className={`${data?.type === 'EXPENSE' ? 'bg-red-100' : 'bg-green-100'} p-3 mb-2 rounded-lg`}
      onPress={onPress}
    >
      <Text className="font-bold text-black text-[18px] capitalize">
        {data.name}
      </Text>
      <Text
        className={`${data?.type === 'EXPENSE' ? 'text-red-900' : 'text-green-900'} text-sm text-[14px] font-bold`}
      >
        {data.amount}€
      </Text>
    </TouchableOpacity>
  );
};

export default EventCard;
