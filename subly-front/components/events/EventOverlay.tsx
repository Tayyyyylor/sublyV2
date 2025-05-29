import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import { createEvent, updateEvent } from '@/services/eventService';
import { getAllCategories } from '@/services/categoryService';
import { getAllRecurrences } from '@/services/recurrenceService';

import { CategoryType, RecurrenceType, TransacType } from '@/types/global';

import Input from '../Input';
import FrequencyPicker from '../FrequencyPicker';
import CategoryPicker from '../CategoryPicker';
import TypeSelector from '../TypeSelector';

import {
  Alert,
  Animated,
  Button,
  InputModeOptions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { EventCreateType } from '@/types/event';

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
  const [allRecurrences, setAllRecurrences] = useState<RecurrenceType[]>([]);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [selectedType, setSelectedType] = useState<TransacType>('EXPENSE');
  const [startDate, setStartDate] = useState<Date>(new Date(selectedDate));
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [selectedRecurrence, setSelectedRecurrence] =
    useState<RecurrenceType | null>(null);

  const inputData = [
    { placeholder: 'name', value: name, onChangeText: setName },
    {
      placeholder: 'amount',
      value: amount,
      onChangeText: setAmount,
      inputMode: 'numeric',
    },
  ];

  const onChangeStartDate = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
      setEndDate(selectedDate);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
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
      onClose();
    });
  };

  const clearFields = () => {
    setName('');
    setAmount('');
    setSelectedRecurrence(null);
    setSelectedCategory(null);
    setStartDate(new Date(selectedDate));
    setHasEndDate(false);
    setEndDate(undefined);
  };

  const handleSubmit = async () => {
    if (!name || !amount || !selectedCategory || !selectedRecurrence) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    const sanitizedAmount = parseFloat(amount.replace(',', '.'));
    try {
      const eventData: EventCreateType = {
        name,
        amount: sanitizedAmount,
        type: selectedType,
        categoryId: selectedCategory.id,
        recurrenceId: selectedRecurrence.id,
        startDate,
        endDate: hasEndDate ? endDate : undefined,
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

        if (recs.length > 0) setSelectedRecurrence(recs[2]); // Monthly by default
        if (cats.length > 0) setSelectedCategory(cats[0]);
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
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setStartDate(new Date(selectedDate));
      setHasEndDate(false);
      setEndDate(undefined);
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
        className="w-full bg-[#121212] rounded-t-3xl"
        style={{
          transform: [{ translateY }],
          maxHeight: '80%',
        }}
      >
        <ScrollView className="p-6">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
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
              <TypeSelector
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
              <FrequencyPicker
                selectedValue={selectedRecurrence?.id as string}
                onValueChange={(id: string) => {
                  const recurrence = allRecurrences.find((r) => r.id === id);
                  if (recurrence) setSelectedRecurrence(recurrence);
                }}
                allRecurrences={allRecurrences}
              />

              <CategoryPicker
                selectedValue={selectedCategory?.id as string}
                onValueChange={(id: string) => {
                  const category = allCategories.find((c) => c.id === id);
                  if (category) setSelectedCategory(category);
                }}
                allCategories={allCategories}
              />
              <View className="flex-row gap-3 items-center w-[100%] justify-evenly">
                <View className="flex justify-center items-center">
                  <Text className="text-white font-bold text-[18px] mb-[20px]">
                    Date de début
                  </Text>
                  <DateTimePicker
                    className="text-white"
                    textColor="white"
                    themeVariant="dark"
                    accentColor="white"
                    testID="dateTimePicker"
                    value={startDate}
                    is24Hour={true}
                    onChange={onChangeStartDate}
                  />
                </View>

                <View className="flex justify-center items-center">
                  <View className="flex-row items-center mb-[20px]">
                    <Text className="text-white font-bold text-[18px] mr-2">
                      Date de fin
                    </Text>
                    <Switch
                      value={hasEndDate}
                      onValueChange={setHasEndDate}
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={hasEndDate ? '#f5dd4b' : '#f4f3f4'}
                    />
                  </View>
                  {hasEndDate && (
                    <DateTimePicker
                      className="text-white"
                      textColor="white"
                      themeVariant="dark"
                      accentColor="white"
                      testID="dateTimePicker"
                      value={endDate || startDate}
                      is24Hour={true}
                      onChange={onChangeEndDate}
                      minimumDate={startDate}
                    />
                  )}
                </View>
              </View>

              <Button title="Add" onPress={handleSubmit} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default EventOverlay;
