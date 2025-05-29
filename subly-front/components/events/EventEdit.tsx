import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { CategoryType, EventType, RecurrenceType } from '@/types/global';
import { updateEvent, deleteEvent } from '@/services/eventService';
import Input from '../Input';
import FrequencyPicker from '../FrequencyPicker';
import CategoryPicker from '../CategoryPicker';
import { useRecurrences } from '@/hooks/useRecurrences';
import { useCategories } from '@/hooks/useCategories';
import TypeSelector from '../TypeSelector';

interface EventEditProps {
  event: EventType;
}

const EventEdit = ({ event }: EventEditProps) => {
  const router = useRouter();
  const { recurrences } = useRecurrences();
  const { categories } = useCategories();
  const [name, setName] = useState<EventType['name']>(event.name);
  const [amount, setAmount] = useState<string>(event.amount as string);
  const [type, setType] = useState<EventType['type']>(event.type);
  const [category, setCategory] = useState<CategoryType>(event.category);
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    event.recurrence,
  );
  const [startDate, setStartDate] = useState<Date>(new Date(event.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(
    event.endDate ? new Date(event.endDate) : undefined,
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    const sanitizedAmount = parseFloat(amount.replace(',', '.'));
    try {
      await updateEvent(event.id, {
        startDate,
        endDate,
        name,
        amount: sanitizedAmount,
        type,
        categoryId: category.id,
        recurrenceId: recurrence.id,
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

  console.log('type', type);

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
      <ScrollView className="p-6">
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
            <View>
              <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
                {' '}
                Nom du mouvement
              </Text>
              <Input value={name} onChangeText={setName} />
            </View>
            <View>
              <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
                Montant
              </Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                inputMode="numeric"
              />
            </View>
            <View>
              <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
                Type
              </Text>
              <TypeSelector selectedType={type} setSelectedType={setType} />
            </View>
            <View>
              <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
                Fréquence
              </Text>
              <FrequencyPicker
                selectedValue={recurrence.id}
                onValueChange={(id: string) => {
                  const recurrence = recurrences.find((r) => r.id === id);
                  if (recurrence) setRecurrence(recurrence);
                }}
                allRecurrences={recurrences}
              />
            </View>
            <View>
              <Text className="text-[#FBBF24] text-[18px] font-bold mb-2">
                Catégorie
              </Text>
              <CategoryPicker
                selectedValue={category.id}
                onValueChange={(id: string) => {
                  const category = categories.find((c) => c.id === id);
                  if (category) setCategory(category);
                }}
                allCategories={categories}
              />
            </View>

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
            className="bg-red-500 p-4 rounded-[5px] mt-6"
            onPress={handleDelete}
          >
            <Text className="text-white text-center text-[18px] font-bold">
              Mettre fin au mouvement
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventEdit;
