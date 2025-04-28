import React from 'react';
import { Text } from 'react-native';

interface SaleOfTheDayProps {
  totalCount?: number;
  currency: string;
}

const SaleOfTheDay = ({ totalCount, currency }: SaleOfTheDayProps) => {
  return (
    <Text className="text-black-700 text-[20px] text-center mt-2 font-bold">
      Dépense prévue ce jour :
      <Text className="text-blue-700">
        {` ${totalCount}`}
        {currency}
      </Text>
    </Text>
  );
};

export default SaleOfTheDay;
