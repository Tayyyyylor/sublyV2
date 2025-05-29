import React from 'react';
import { Text } from 'react-native';

interface SaleOfTheDayProps {
  totalCount?: number;
  currency: string;
}

const SaleOfTheDay = ({ totalCount = 0, currency }: SaleOfTheDayProps) => {
  return (
    <Text className="text-white text-[20px] text-center mt-2 font-bold">
      Total du jour :
      <Text
        className={`${totalCount >= 0 ? 'text-emerald-500' : 'text-red-400'}`}
      >
        {` ${totalCount}`}
        {currency}
      </Text>
    </Text>
  );
};

export default SaleOfTheDay;
