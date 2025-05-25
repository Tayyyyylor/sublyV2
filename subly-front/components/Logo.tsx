import React from 'react';
import { Image } from 'react-native';

const Logo = () => {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      className="w-[250px] h-[100px]"
    />
  );
};

export default Logo;
