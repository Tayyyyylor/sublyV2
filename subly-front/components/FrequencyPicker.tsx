import { translateFrequency } from '@/helpers/global.utils';
import { RecurrenceType } from '@/types/global';
import { Picker } from '@react-native-picker/picker';
import React from 'react';

interface PickerProps {
  selectedValue: string;
  onValueChange: (e: any) => void;
  allRecurrences: RecurrenceType[];
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
      {allRecurrences.map((r) => {
        const displayFrequency = translateFrequency(r.frequency);
        return (
          <Picker.Item
            key={r.id}
            label={displayFrequency}
            value={r.id}
            color="white"
          />
        );
      })}
    </Picker>
  );
};

export default FrequencyPicker;
