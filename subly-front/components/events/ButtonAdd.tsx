import React from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ButtonAddProps {
  openModal: () => void;
  className?: string;
}

const ButtonAdd = ({ openModal, className }: ButtonAddProps) => {
  return (
    <Pressable
      onPress={openModal}
      className={`${className} bg-yellow-400 w-[60px] h-[60px] rounded-full items-center justify-center shadow-lg`}
    >
      <Ionicons name="add" size={32} color="black" />
    </Pressable>
  );
};

export default ButtonAdd;
