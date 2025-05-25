import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

interface ButtonAuthProps {
  onPress: () => void;
  onPressSecondButton: () => void;
  label: string;
  labelSecondButton: string;
  text: string;
}

const ButtonAuth = ({
  onPress,
  label,
  text,
  labelSecondButton,
  onPressSecondButton,
}: ButtonAuthProps) => {
  return (
    <View className="w-[100%] flex-col gap-20">
      <TouchableOpacity
        onPress={onPress}
        className="bg-yellow-400 p-5 rounded-[8px] w-[100%]"
      >
        <Text className="text-black text-center font-bold text-[20px]">
          {label}
        </Text>
      </TouchableOpacity>
      <View className="flex-col items-center gap-5">
        <Text className="text-white text-[16px]">{text}</Text>
        <Pressable onPress={onPressSecondButton}>
          <Text className="text-yellow-400 font-bold text-[20px]">
            {labelSecondButton}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ButtonAuth;
