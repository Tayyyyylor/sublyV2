import { EventType, Frequency } from '@/types/global';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BadgeRecurrence from '../BadgeRecurrence';
import { useRecurrences } from '@/hooks/useRecurrences';
import { translateFrequency } from './Events.utils';





interface EventProps {
  id: string;
  data: EventType;
  onPress: () => void;
}

const EventCard = ({ data, onPress }: EventProps) => {
  const { data: recurrences } = useRecurrences();

  const recurrence = recurrences?.find((r) => r.id === data.recurrenceId);

  const displayFrequency = recurrence?.frequency
    ? translateFrequency(recurrence.frequency)
    : undefined;

  const isExpense = data.type === 'EXPENSE';
  const amountText = isExpense ? `-${data.amount}€` : `+${data.amount}€`;
  const amountColor = isExpense ? 'text-red-600' : 'text-emerald-600';

  return (
    <TouchableOpacity
      className="bg-gray-200 p-3 mb-2 rounded-lg"
      onPress={onPress}
    >
      <View className="flex-column items-start gap-1">
        <View className="flex-row items-center justify-between w-full">
          <Text className="font-bold text-black text-[18px] capitalize">
            {data.name}
          </Text>
          <Text className={`${amountColor} text-[16px] font-bold`}>
            {amountText}
          </Text>
        </View>
        <View className="flex-row items-end gap-1">
          <Text>{data?.category?.icon}</Text>
          <Text className="text-[12px]">{data?.category?.name}</Text>
        </View>

        {recurrence && (
          <View className="flex-row items-center gap-2">
            <BadgeRecurrence recurrence={displayFrequency as Frequency} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
