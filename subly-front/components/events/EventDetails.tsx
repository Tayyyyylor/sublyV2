import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { getOneEvent } from '@/services/eventService';
import { EventType } from '@/types/global';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const isExpense = event?.type === 'EXPENSE';

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const infos = [
    {
      label: 'Fréquence',
      value: event?.recurrence?.frequency || '',
    },
    {
      label: 'Catégories',
      value: event?.category?.name || '',
    },
    {
      label: 'Date de début',
      value: formatDate(event?.startDate),
    },
    {
      label: 'Date de fin',
      value: formatDate(event?.endDate),
    },
  ];

  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getOneEvent(id as string);
        setEvent(resp);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      }
    };

    fetchEvents();
  }, [id]);

  return (
    <SafeAreaView className="relative flex-1 items-center p-4">
      <Pressable
        onPress={handleClickBack}
        className="flex-row justify-start w-full ml-10 mb-5"
      >
        <Text className="text-white text-[18px] font-bold">Retour</Text>
      </Pressable>
      <Text className="text-white text-[24px] font-bold mb-5">
        {event?.name}
      </Text>
      <View
        className={` ${isExpense ? 'bg-red-300' : 'bg-green-300'} p-2 rounded-[8px] mb-3`}
      >
        <Text
          className={`${isExpense ? 'text-red-800' : 'text-green-800'} text-[18px] font-bold`}
        >
          {isExpense ? `-${event?.amount}€` : `+${event?.amount}€`}
        </Text>
      </View>
      <View className="flex-column w-full p-5 gap-3">
        {infos.map((info, index) => (
          <View
            key={index}
            className="flex-row justify-between w-full border-white p-3 border"
          >
            <Text className="text-white text-[18px] font-bold">
              {info.label}
            </Text>
            <Text className="text-white text-[18px] font-bold">
              {info.value}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default EventDetails;
