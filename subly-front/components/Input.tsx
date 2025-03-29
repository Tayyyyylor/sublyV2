import React from 'react';
import { InputModeOptions, TextInput } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  inputMode?: InputModeOptions | undefined;
}

const Input = ({ placeholder, value, onChangeText, inputMode }: InputProps) => {
  return (
    <TextInput
      className="bg-[pink] p-3 w-full border-2 border-indigo-500"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      inputMode={inputMode}
    />
  );
};

export default Input;
