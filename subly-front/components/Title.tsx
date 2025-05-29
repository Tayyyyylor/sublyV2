import React from 'react';
import { Text } from 'react-native';

interface TitleProps {
  label: string;
}

const Title = ({ label }: TitleProps) => {
  return (
    <Text className="text-[36px] font-bold text-white text-center">
      {label}
    </Text>
  );
};

export default Title;
