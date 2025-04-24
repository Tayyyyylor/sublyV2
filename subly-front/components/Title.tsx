import React from 'react';
import { Text } from 'react-native';

interface TitleProps {
  label: string;
}

const Title = ({ label }: TitleProps) => {
  return (
    <Text className="text-xl font-bold text-black-600 text-center">
      {label}
    </Text>
  );
};

export default Title;
