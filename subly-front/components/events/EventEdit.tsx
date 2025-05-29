import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { EventType } from '@/types/global';
import { updateEvent, deleteEvent } from '@/services/eventService';

interface EventEditProps {
  event: EventType;
}

const EventEdit = ({ event }: EventEditProps) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>(new Date(event.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(
    event.endDate ? new Date(event.endDate) : undefined,
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      await updateEvent(event.id, {
        startDate,
        endDate,
      });
      Alert.alert('Succès', 'Événement modifié avec succès !');
      router.back();
    } catch (error) {
      Alert.alert('Erreur', "Impossible de modifier l'événement.");
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
              await deleteEvent(event.id);
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

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row justify-between items-center w-full p-4">
        <Pressable onPress={handleCancel}>
          <Text className="text-white text-[18px]">Annuler</Text>
        </Pressable>
        <Pressable
          className="bg-[#FBBF24] p-3 rounded-[5px]"
          onPress={handleSave}
        >
          <Text className="text-[18px] font-bold">Valider</Text>
        </Pressable>
      </View>

      <View className="p-4">
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">{event.name}</Text>
          <Text
            className={`text-xl font-bold ${event.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}
          >
            {event.type === 'EXPENSE' ? '-' : '+'}
            {event.amount}€
          </Text>
        </View>

        <View className="bg-gray-800 rounded-[5px] p-4">
          <View className="mb-4">
            <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
              Date de début
            </Text>
            <DateTimePicker
              value={startDate}
              onChange={(_, date) => date && setStartDate(date)}
              mode="date"
              display="default"
              textColor="white"
              themeVariant="dark"
            />
          </View>

          <View className="mb-4">
            <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
              Date de fin
            </Text>
            <DateTimePicker
              value={endDate || startDate}
              onChange={(_, date) => setEndDate(date)}
              mode="date"
              display="default"
              textColor="white"
              themeVariant="dark"
              minimumDate={startDate}
            />
          </View>
        </View>

        <Pressable
          className="bg-pink-500 p-4 rounded-[5px] mt-6"
          onPress={handleDelete}
        >
          <Text className="text-white text-center text-[18px] font-bold">
            Mettre fin au mouvement
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EventEdit;
