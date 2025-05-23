import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import { createEvent } from '@/services/eventService';
import { getAllCategories } from '@/services/categoryService';
import { getAllRecurrences } from '@/services/recurrenceService';

import { CategoryType, FrequencyType, TransacType } from '@/types/global';

import Input from '../Input';
import FrequencyPicker from '../FrequencyPicker';
import CategoryPicker from '../CategoryPicker';

import {
  Alert,
  Animated,
  Button,
  InputModeOptions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
interface EventOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
}

const EventOverlay = ({
  isVisible,
  onClose,
  selectedDate,
}: EventOverlayProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const [_, setIsLoading] = useState(true);

  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [allRecurrences, setAllRecurrences] = useState<FrequencyType[]>([]);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [selectedType, setSelectedType] = useState<TransacType>('EXPENSE');
  const [date, setDate] = useState<Date>(new Date(selectedDate));

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedRecurrenceId, setSelectedRecurrenceId] = useState<string>('');

  console.log('allCategories', allCategories);
  console.log('selectedCategoryId', selectedCategoryId);
  console.log('selectedRecurrenceId', selectedRecurrenceId);
  console.log('allRecurrences', allRecurrences);
  const inputData = [
    { placeholder: 'name', value: name, onChangeText: setName },
    {
      placeholder: 'amount',
      value: amount,
      onChangeText: setAmount,
      inputMode: 'numeric',
    },
  ];

  const onChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
      setDate(selectedDate);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // Départ depuis le bas (500) jusqu'à position finale (0)
  });

  const handleClose = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); // Appelé après la fin de l'animation
    });
  };

  const clearFields = () => {
    setName('');
    setAmount('');
    setSelectedRecurrenceId('');
    setSelectedCategoryId('');
    setDate(new Date(selectedDate));
  };

  const handleSubmit = async () => {
    if (!name || !amount) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    const sanitizedAmount = parseFloat(amount.replace(',', '.'));
    try {
      const eventData = {
        name,
        amount: sanitizedAmount,
        type: selectedType,
        recurrenceId: selectedRecurrenceId,
        categoryId: selectedCategoryId,
        startDate: date,
      };
      await createEvent(eventData);
      Alert.alert('Succès', 'Event créé avec succès !');
      clearFields();
      handleClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getAllCategories();
        setAllCategories(cats);

        const recs = await getAllRecurrences();
        setAllRecurrences(recs);

        if (recs.length > 0) setSelectedRecurrenceId(recs[2].id);
        if (cats.length > 0) setSelectedCategoryId(cats[0].id);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger la config.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Réinitialisation quand invisible
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setDate(new Date(selectedDate));
    }
  }, [isVisible, selectedDate]);

  const handleClickIncome = () => {
    setSelectedType('INCOME');
  };
  const handleClickExpense = () => {
    setSelectedType('EXPENSE');
  };

  return (
    <Animated.View className="absolute inset-0" style={{ opacity: fadeAnim }}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black bg-opacity-50" />
      </TouchableWithoutFeedback>

      <Animated.View
        className="absolute bottom-0 w-full bg-slate-900 rounded-t-3xl p-6"
        style={{
          transform: [{ translateY }],
          maxHeight: '90%',
        }}
      >
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 "
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <SafeAreaView className="bg-slate-900">
                <View className="p-2 gap-5 mb-5">
                  {inputData.map((input, index) => (
                    <Input
                      key={index}
                      inputMode={input.inputMode as InputModeOptions}
                      placeholder={input.placeholder}
                      onChangeText={input.onChangeText}
                      value={input.value}
                    />
                  ))}
                </View>
                <View className="flex-row gap-3 items-center w-[100%]">
                  <Pressable
                    className={`p-3 flex-1 ${
                      selectedType === 'EXPENSE'
                        ? 'bg-red-500'
                        : 'bg-transparent'
                    }`}
                    onPress={handleClickExpense}
                  >
                    <Text className="text-white text-center">Dépenses</Text>
                  </Pressable>
                  <Pressable
                    className={`p-3 flex-1 ${
                      selectedType === 'INCOME'
                        ? 'bg-green-500'
                        : 'bg-transparent'
                    }`}
                    onPress={handleClickIncome}
                  >
                    <Text className="text-white text-center">Revenus</Text>
                  </Pressable>
                </View>
                <FrequencyPicker
                  selectedValue={selectedRecurrenceId}
                  onValueChange={(id: string) => setSelectedRecurrenceId(id)}
                  allRecurrences={allRecurrences}
                />

                <CategoryPicker
                  selectedValue={selectedCategoryId}
                  onValueChange={(id: string) => setSelectedCategoryId(id)}
                  allCategories={allCategories}
                />

                <View className="flex justify-center items-center">
                  <Text className="text-white font-bold text-[18px] mb-[20px]">
                    Date de début
                  </Text>
                  <DateTimePicker
                    className="text-white"
                    textColor="white"
                    themeVariant="light"
                    accentColor="white"
                    testID="dateTimePicker"
                    value={date}
                    is24Hour={true}
                    onChange={onChange}
                  />
                </View>

                <Button title="Add" onPress={handleSubmit} />
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default EventOverlay;
