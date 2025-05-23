import { CategoryType } from '@/types/global';
import { Picker } from '@react-native-picker/picker';
import React from 'react';

interface PickerProps {
  selectedValue: string;
  onValueChange: (e: any) => void;
  allCategories: CategoryType[];
}

const CategoryPicker = ({
  selectedValue,
  onValueChange,
  allCategories,
}: PickerProps) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => {
        onValueChange(itemValue);
      }}
      style={{ color: 'white' }}
    >
      {allCategories.map((r) => (
        <Picker.Item key={r.id} label={r.name} value={r.id} />
      ))}
    </Picker>
  );
};

export default CategoryPicker;
