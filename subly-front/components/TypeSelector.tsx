import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface TypeSelectorProps {}

const TypeSelector = () => {
  return (
    <View className="flex-row gap-3 items-center w-[100%]">
      <Pressable className="bg-red-500 p-3 flex-1">
        <Text className="text-white text-center">Dépenses</Text>
      </Pressable>
      <Pressable className="bg-green-500 p-3 flex-1">
        <Text className="text-white text-center">Revenus</Text>
      </Pressable>
    </View>
  );
};

export default TypeSelector;
