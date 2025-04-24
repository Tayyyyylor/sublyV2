import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonAuthProps {
  onPress: () => void;
  label: string;
  isBlack?: boolean;
}

const ButtonAuth = ({ onPress, label, isBlack = true }: ButtonAuthProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isBlack ? 'bg-black' : 'bg-white'} p-3 rounded w-[70%]`}
    >
      <Text className={`${isBlack ? 'text-white' : 'text-black'} text-center`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonAuth;
