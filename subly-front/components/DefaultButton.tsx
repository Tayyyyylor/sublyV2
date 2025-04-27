import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface DefaultButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
}

const DefaultButton = ({ className, label, onPress }: DefaultButtonProps) => {
  return (
    <TouchableOpacity
      className={`${className} bg-red-400 items-center w-[50%] rounded-[8px] p-4`}
      onPress={onPress}
    >
      <Text className="font-bold">{label}</Text>
    </TouchableOpacity>
  );
};

export default DefaultButton;
