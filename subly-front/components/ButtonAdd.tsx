import React from 'react';
import { Button, Pressable, Text } from 'react-native';

interface ButtonAddProps {
  openModal: () => void;
}

const ButtonAdd = ({ openModal }: ButtonAddProps) => {
  return (
    <Pressable
      onPress={openModal}
      className="bg-blue-500 br-100 w-[20px] flex items-center justify-center rounded-full"
    >
      <Text className="text-white">+</Text>
    </Pressable>
  );
};

export default ButtonAdd;
