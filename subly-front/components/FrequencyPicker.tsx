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
      style={{color: "white"}}
    >
      <Picker.Item label="Une fois" value="one" />
      <Picker.Item label="Hebdomadaire" value="hebdo" />
      <Picker.Item label="Mensuel" value="monthly" />
      <Picker.Item label="Trimestriel" value="trimestriel" />
      <Picker.Item label="Annuel" value="yearly" />
    </Picker>
  );
};

export default FrequencyPicker;
