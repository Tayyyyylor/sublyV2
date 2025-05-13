import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  className?: string;
}

export function Text({ className = '', ...props }: CustomTextProps) {
  const defaultClass = className.includes('text-') ? '' : 'text-white';
  return <RNText {...props} className={`${defaultClass} ${className}`} />;
}
