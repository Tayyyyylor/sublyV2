import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import { deleteEvent, getOneEvent, modifyEvent } from '@/services/eventService';
import { EventType, FrequencyType } from '@/types/global';

import DefaultButton from '../DefaultButton';
import DefaultModal from '../DefaultModal';
import FrequencyPicker from '../FrequencyPicker';
import Input from '../Input';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isEditingFrequency, setIsEditingFrequency] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState<FrequencyType>();

  const handleClickBack = () => {
    router.back();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModifyEvent = async () => {
    if (!event) return;

    const payload = {
      name: newName || event.name,
      amount: newAmount
        ? parseFloat(newAmount.replace(',', '.'))
        : event.amount,
      frequency: newFrequency || event,
    };

    if (isNaN(payload.amount)) {
      Alert.alert('Erreur', 'Le montant doit être un nombre valide.');
      return;
    }

    try {
      await modifyEvent(id as string, payload);
      Alert.alert('Succès', 'Événement modifié.');
    } catch (error) {
      Alert.alert('Erreur', "Impossible de modifier l'événement.");
      console.error('Erreur modification event :', error);
    }
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getOneEvent(id as string);
        setEvent(resp);
        setNewName(resp.name);
        setNewAmount(resp.amount.toString());
        setNewFrequency(resp.frequency);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      }
    };

    fetchEvents();
  }, [id]);

  return (
    <SafeAreaView className="relative flex-1 items-center p-4">
      <Button onPress={handleClickBack} title="Retour" />
      <View className="flex-row items-center gap-2 mt-8">
        {isEditingName ? (
          <TextInput
            value={newName}
            onChangeText={setNewName}
            onBlur={handleModifyEvent}
            className="text-[30px] font-bold text-center border-b border-gray-400 w-[70%] text-white"
          />
        ) : (
          <View className="">
            <Text className="text-[30px] font-bold text-center text-white capitalize w-[100%]">
              {event?.name}
            </Text>
            <TouchableOpacity onPress={() => setIsEditingName(true)}>
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-row items-center gap-2 mt-4">
          {isEditingAmount ? (
            <Input
              value={newAmount}
              onChangeText={setNewAmount}
              inputMode="numeric"
            />
          ) : (
            <>
              <Text className="text-[20px] text-white">{event?.amount} €</Text>
              <TouchableOpacity onPress={() => setIsEditingAmount(true)}>
                <Ionicons name="pencil" size={20} color="gray" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View className="flex-row items-center gap-2 mt-4">
        {isEditingFrequency ? (
          <View className="w-full">
            <FrequencyPicker
              selectedValue={newFrequency}
              onValueChange={(itemValue) => {
                setNewFrequency(itemValue);
                handleModifyEvent();
                setIsEditingFrequency(false);
              }}
            />
          </View>
        ) : (
          <>
            <Text className="text-white">{event?.frequency}</Text>
            <TouchableOpacity onPress={() => setIsEditingFrequency(true)}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View className="mt-10">
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
