import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonAuthProps {
  onPress: () => void;
  label: string;
  isBlack?: boolean;
  isDisabled?: boolean;
}

const ButtonAuth = ({
  onPress,
  label,
  isBlack = true,
  isDisabled = false,
}: ButtonAuthProps) => {
  return (
    <TouchableOpacity
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={`${isBlack ? 'bg-black' : 'bg-white'} p-3 rounded w-[70%] opacity-${isDisabled ? '40' : '100'}`}
    >
      <Text className={`${isBlack ? 'text-white' : 'text-black'} text-center`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonAuth;
