import React from 'react';
import { TextInput } from 'react-native';

interface InputProps {
  placeholder: string;
}

const Input = ({ placeholder }: InputProps) => {
  return (
    <TextInput
      className="bg-[pink] p-3 w-full border-2 border-indigo-500"
      placeholder={placeholder}
    />
  );
};

export default Input;
