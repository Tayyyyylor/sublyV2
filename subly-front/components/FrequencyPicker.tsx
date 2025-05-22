import { Picker } from '@react-native-picker/picker';
import React from 'react';

interface PickerProps {
  selectedValue: string;
  onValueChange: (e: any) => void;
}

const FrequencyPicker = ({ selectedValue, onValueChange }: PickerProps) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => {
        onValueChange(itemValue);
      }}
      style={{ color: 'white' }}
    >
      <Picker.Item label="Une fois" value="DAILY" />
      <Picker.Item label="Hebdomadaire" value="WEEKLY" />
      <Picker.Item label="Mensuel" value="MONTHLY" />
      <Picker.Item label="Trimestriel" value="QUARTERLY" />
      <Picker.Item label="Annuel" value="YEARLY" />
    </Picker>
  );
};

export default FrequencyPicker;
