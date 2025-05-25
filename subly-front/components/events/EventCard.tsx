import { EventType } from '@/types/global';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BadgeRecurrence from '../BadgeRecurrence';

interface EventProps {
  id: string;
  data: EventType;
  onPress: () => void;
}

const EventCard = ({ data, onPress }: EventProps) => {
  console.log('data', data);
  return (
    <TouchableOpacity
      className={`${data?.type === 'EXPENSE' ? 'bg-red-100' : 'bg-green-100'} p-3 mb-2 rounded-lg`}
      onPress={onPress}
    >
      <View className="flex-column items-start gap-1">
        <View className="flex-row items-center gap-4">
          <Text className="font-bold text-black text-[18px] capitalize">
            {data.name}
          </Text>
          <BadgeRecurrence />
        </View>
        <View className="flex-row items-end gap-1">
          <Text>{data?.category?.icon}</Text>
          <Text className="text-[12px]">{data?.category?.name}</Text>
        </View>
        <Text
          className={`${data?.type === 'EXPENSE' ? 'text-red-900' : 'text-green-900'} text-[16px] font-bold`}
        >
          {data.amount}€
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
