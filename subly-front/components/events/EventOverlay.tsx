import React, { useEffect, useState } from 'react';
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
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { createEvent } from '@/services/eventService';
import { CategoryType, FrequencyType, TransacType } from '@/types/global';

import Input from '../Input';
import FrequencyPicker from '../FrequencyPicker';
import { getAllCategories } from '@/services/categoryService';
import CategoryPicker from '../CategoryPicker';
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
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [_, setIsLoading] = useState(true);
  const [selectedFrequency, setSelectedFrequency] =
    useState<FrequencyType>('MONTHLY');
  const [selectedCategory, setSelectedCategory] =
    useState<FrequencyType>('MONTHLY');
  const [selectedType, setSelectedType] = useState<TransacType>('EXPENSE');

  const [date, setDate] = useState<Date>(new Date(selectedDate));
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
    setSelectedFrequency('MONTHLY');
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
        frequency: selectedFrequency,
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
    const fetchEvents = async () => {
      try {
        const resp = await getAllCategories();
        setAllCategories(resp);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
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
          maxHeight: '100%',
        }}
      >
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
                    selectedType === 'EXPENSE' ? 'bg-red-500' : 'bg-transparent'
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
                selectedValue={selectedFrequency}
                onValueChange={(itemValue) => setSelectedFrequency(itemValue)}
              />

              <CategoryPicker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
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
      </Animated.View>
    </Animated.View>
  );
};

export default EventOverlay;
