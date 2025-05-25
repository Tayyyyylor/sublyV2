import React from 'react';
import { Text, View } from 'react-native';

const BadgeRecurrence = () => {
  const recurrences = [
    {
      name: 'DAILY',
    },
    {
      name: 'WEEKLY',
    },
    {
      name: 'MONTHLY',
    },
    {
      name: 'QUARTERLY',
    },
    {
      name: 'YEARLY',
    },
  ];
  return (
    <View className="bg-blue-100 rounded-full p-2">
      <Text className="text-black text-[12px] font-bold">DAILY</Text>
    </View>
  );
};

export default BadgeRecurrence;
