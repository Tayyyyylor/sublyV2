import { EventType } from '@/types/global';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface TypeSelectorProps {
  selectedType: 'EXPENSE' | 'INCOME';
  setSelectedType: (type: 'EXPENSE' | 'INCOME') => void;
}

const TypeSelector = ({ selectedType, setSelectedType }: TypeSelectorProps) => {
  const handleClickExpense = () => {
    setSelectedType('EXPENSE');
  };
  const handleClickIncome = () => {
    setSelectedType('INCOME');
  };
  return (
    <View className="flex-row gap-3 items-center w-[100%]">
      <Pressable
        className={`p-3 flex-1 ${
          selectedType === 'EXPENSE' ? 'bg-red-500' : 'bg-transparent'
        }`}
        onPress={handleClickExpense}
      >
        <Text className="text-white text-center">Dépenses</Text>
      </Pressable>
      <Pressable
        className={`p-3 flex-1 ${
          selectedType === 'INCOME' ? 'bg-green-500' : 'bg-transparent'
        }`}
        onPress={handleClickIncome}
      >
        <Text className="text-white text-center">Revenus</Text>
      </Pressable>
    </View>
  );
};

export default TypeSelector;
