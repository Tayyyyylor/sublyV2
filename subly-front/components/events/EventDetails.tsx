import { deleteEvent, getOneEvent } from '@/services/eventService';
import { EventType } from '@/types/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import DefaultButton from '../DefaultButton';
import DefaultModal from '../DefaultModal';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log('event', event);

  const handleClickBack = () => {
    router.back();
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id as string);
      Alert.alert('Succès', 'Événement supprimé.');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', "Impossible de supprimer l'événement.");
      console.error('Erreur suppression event :', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
  }, []);

  return (
    <SafeAreaView className="relative flex column items-center gap-20">
      <Button onPress={handleClickBack} title="Back" />
      <View className="flex-col items-center gap-5">
        <Text className="text-[50px] font-bold text-center">{event?.name}</Text>
        <Text className="text-[20px] text-red-700 text-center bg-red-300 p-2 rounded-[10px]">
          {event?.amount}€
        </Text>
      </View>
      <View className="bg-grey-500 w-[100%] h-[100dvh] items-center">
        <Text>{event?.frequency}</Text>
      </View>
      <View>
        <DefaultButton label="Supprimer event" onPress={handleOpenModal} />
      </View>
      {showModal && (
        <DefaultModal
          onPressConfirm={handleDeleteEvent}
          onPressCancel={handleCloseModal}
          label="Voulez-vous vraiment supprimer cet évènement ?"
        />
      )}
    </SafeAreaView>
  );
};

export default EventDetails;
