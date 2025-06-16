import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface ToggleTabsProps {
  selected: 'EXPENSE' | 'INCOME';
  onSelect: (type: 'EXPENSE' | 'INCOME') => void;
}

const ToggleTabs = ({ selected, onSelect }: ToggleTabsProps) => {
  return (
    <View className="flex-row bg-gray-800 rounded-lg p-1 mb-4">
      {(['EXPENSE', 'INCOME'] as const).map((type) => (
        <Pressable
          key={type}
          onPress={() => onSelect(type)}
          className={`flex-1 py-2 rounded-md items-center ${
            selected === type ? 'bg-white' : 'bg-transparent'
          }`}
        >
          <Text
            className={
              selected === type ? 'text-black font-bold' : 'text-white'
            }
          >
            {type === 'EXPENSE' ? 'Dépenss' : 'Revens'}
            on change pleins de truuuuucs 
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ToggleTabs;
