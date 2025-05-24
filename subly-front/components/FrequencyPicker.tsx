import { FrequencyType } from '@/types/global';
import { Picker } from '@react-native-picker/picker';
import React from 'react';

interface PickerProps {
  selectedValue: string;
  onValueChange: (e: any) => void;
  allRecurrences: FrequencyType[];
}

const FrequencyPicker = ({
  selectedValue,
  onValueChange,
  allRecurrences,
}: PickerProps) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => {
        onValueChange(itemValue);
      }}
    >
      {allRecurrences.map((r) => (
        <Picker.Item
          key={r.id}
          label={r.frequency}
          value={r.id}
          color="white"
        />
      ))}
    </Picker>
  );
};

export default FrequencyPicker;
