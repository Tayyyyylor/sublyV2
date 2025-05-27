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
import { EventType, Frequency, FrequencyType } from '@/types/global';

import DefaultButton from '../DefaultButton';
import DefaultModal from '../DefaultModal';
import FrequencyPicker from '../FrequencyPicker';
import Input from '../Input';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);

  const infos = [
    {
      label: "Nom",
      value: ""
    },
    {
      label: "Montant",
      value: ""
    },
    {
      label: "Fréquence",
      value: ""
    },
    {
      label: "Catégorie",
      value: ""
    },
    {
      label: "Date de début",
      value: ""
    },
    {
      label: "Date de fin",
      value: ""
    },
  ]
 

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
      <Text className='text-white'>{event?.name}</Text>
      <View>
        {infos.map((info, index) => (
          <View key={index}>
            <Text className='text-white'>{info.label}</Text>
            <Text className='text-white'>{info.value}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default EventDetails;
