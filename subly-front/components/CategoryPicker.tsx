import { Picker } from '@react-native-picker/picker';
import React from 'react';

interface PickerProps {
  selectedValue: string;
  onValueChange: (e: any) => void;
}

const CategoryPicker = ({ selectedValue, onValueChange }: PickerProps) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => {
        onValueChange(itemValue);
      }}
      style={{ color: 'white' }}
    >
      <Picker.Item label="Nourriture" value="FOOD" />
      <Picker.Item label="Transports" value="TRANSPORT" />
      <Picker.Item label="Maison" value="HOUSING" />
    </Picker>
  );
};

export default CategoryPicker;
