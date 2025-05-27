import React from 'react';
import { Text, View } from 'react-native';

interface BadgeRecurrenceProps {
  recurrence: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE';
}

const BadgeRecurrence = ({ recurrence }: BadgeRecurrenceProps) => {
  const label = recurrence.charAt(0) + recurrence.slice(1).toLowerCase();

  return (
    <View className="bg-blue-100 rounded-full p-2">
      <Text className="text-black text-[12px] font-bold">{label}</Text>
    </View>
  );
};

export default BadgeRecurrence;
