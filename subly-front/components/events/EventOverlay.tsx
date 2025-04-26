import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  InputModeOptions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../Input';
import { createEvent } from '@/services/eventService';
import { FrequencyType } from '@/types/global';
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
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [selectedFrequency, setSelectedFrequency] =
    useState<FrequencyType>('monthly');

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
      handleClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter.');
    }
  };

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

  return (
    <Animated.View className="absolute inset-0" style={{ opacity: fadeAnim }}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black bg-opacity-50" />
      </TouchableWithoutFeedback>

      <Animated.View
        className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6"
        style={{
          transform: [{ translateY }],
          maxHeight: '80%', // Limite à 80% de la hauteur
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <SafeAreaView>
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
            <Picker
              selectedValue={selectedFrequency}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedFrequency(itemValue)
              }
            >
              <Picker.Item label="Une fois" value="one" />
              <Picker.Item label="Hebdomadaire" value="hebdo" />
              <Picker.Item label="Mensuel" value="monthly" />
              <Picker.Item label="Trimestriel" value="trimestriel" />
              <Picker.Item label="Annuel" value="yearly" />
            </Picker>
            <View className="flex justify-center items-center">
              <Text className="text-black font-bold text-[18px] mb-[20px]">
                Date de début
              </Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                is24Hour={true}
                onChange={onChange}
              />
            </View>

            <Button title="Add" onPress={handleSubmit} />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
};

export default EventOverlay;
