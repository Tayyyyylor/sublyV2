import React from 'react';
import { TextInput } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string
  onChangeText: (text: string) => void;
}

const Input = ({ placeholder, value, onChangeText}: InputProps) => {
  return (
    <TextInput
      className="bg-[pink] p-3 w-full border-2 border-indigo-500"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default Input;
