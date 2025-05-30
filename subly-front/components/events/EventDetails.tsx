import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { deleteEvent, getOneEvent } from '@/services/eventService';
import { EventType } from '@/types/global';
import { translateFrequency } from '@/helpers/global.utils';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const isExpense = event?.type === 'EXPENSE';

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const displayFrequency = event?.recurrence?.frequency
    ? translateFrequency(event?.recurrence?.frequency).toLowerCase()
    : undefined;

  const infos = [
    {
      label: 'Fréquence',
      value: displayFrequency || '',
      hasBorder: true,
    },
    {
      label: 'Catégories',
      value: event?.category?.icon + ' ' + event?.category?.name || '',
      hasBorder: true,
    },
    {
      label: 'Date de début',
      value: formatDate(event?.startDate),
      hasBorder: true,
    },
    {
      label: 'Date de fin',
      value: formatDate(event?.endDate),
      hasBorder: false,
    },
  ];

  const handleClickBack = () => {
    router.back();
  };

  const handleClickEdit = () => {
    if (event) {
      router.push(`/event/${event.id}/edit`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet événement ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event?.id as string);
              Alert.alert('Succès', 'Événement supprimé avec succès !');
              router.back();
            } catch (error) {
              Alert.alert('Erreur', "Impossible de supprimer l'événement.");
            }
          },
        },
      ],
    );
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
      <View className="flex-row justify-between items-center w-full p-4 mt-5">
        <Pressable onPress={handleClickBack}>
          <Text className="text-white text-[18px] font-bold">Retour</Text>
        </Pressable>
        <Pressable
          className="bg-[#FBBF24] p-3 rounded-[5px]"
          onPress={handleClickEdit}
        >
          <Text className=" text-[18px] font-bold">Modifier</Text>
        </Pressable>
      </View>
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
      <View className="flex-column w-[95%] rounded-[5px] bg-gray-800 mt-[30px]">
        {infos.map((info, index) => (
          <View
            key={index}
            className={`flex-row justify-between w-full ${info.hasBorder ? 'border-gray-600 border-b' : ''} p-4`}
          >
            <Text className="text-[#FBBF24] text-[18px] font-bold">
              {info.label}
            </Text>
            <Text className="text-white text-[18px] font-bold">
              {info.value === '' || info.value === undefined ? '-' : info.value}
            </Text>
          </View>
        ))}
      </View>
      <Pressable
        className="bg-red-500 p-4 rounded-[5px] mt-6"
        onPress={handleDelete}
      >
        <Text className="text-white text-center text-[18px] font-bold">
          Mettre fin au mouvement
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default EventDetails;
