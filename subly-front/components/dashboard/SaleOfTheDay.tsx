import React from 'react';
import { Text } from 'react-native';

interface SaleOfTheDayProps {
  totalCount?: number;
  currency: string;
}

const SaleOfTheDay = ({ totalCount, currency }: SaleOfTheDayProps) => {
  return (
    <Text className="text-white text-[20px] text-center mt-2 font-bold">
      Dépense prévue ce jour :
      <Text className="text-violet-400">
        {` ${totalCount}`}
        {currency}
      </Text>
    </Text>
  );
};

export default SaleOfTheDay;
